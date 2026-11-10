import { Plugin } from "@opencode/plugin";

const PROVIDER_ID = "clinepass";
const DEFAULT_BASE_URL = "https://api.cline.bot/v1";

export function getApiKey() {
  return process.env.CLINEPASS_API_KEY || process.env.CLINE_API_KEY || "";
}

export function getBaseUrl() {
  return process.env.CLINEPASS_BASE_URL || DEFAULT_BASE_URL;
}

export async function fetchModels(baseUrl = getBaseUrl(), apiKey = getApiKey()) {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/models`, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
  });
  if (!res.ok) throw new Error(`Failed to fetch models: ${res.status}`);
  const data = await res.json();
  const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  return list.map((m) => ({
    id: m.id,
    name: m.name || m.id,
    family: "clinepass",
    providerID: PROVIDER_ID,
    api: { id: m.id, url: baseUrl, npm: "@ai-sdk/openai" },
    capabilities: {
      temperature: m.capabilities?.temperature ?? true,
      reasoning: m.capabilities?.reasoning ?? false,
      attachment: m.capabilities?.attachment ?? false,
      toolCall: m.capabilities?.toolCall ?? true,
    },
    cost: m.cost || { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    limit: m.limit || { context: 128000, output: 8192 },
  }));
}

async function setupV2(ctx) {
  let models = [];
  try {
    models = await fetchModels();
  } catch (err) {
    console.warn("[opencode-clinepass] could not fetch models:", err?.message);
  }

  ctx.provider.transform((editor) => {
    const existing = editor.get(PROVIDER_ID);
    if (existing) return;

    editor.add({
      info: {
        id: PROVIDER_ID,
        name: "Clinepass",
        env: ["CLINEPASS_API_KEY"],
        source: "custom",
      },
      models,
    });
  });

  try {
    const { createOpenAI } = await import("@ai-sdk/openai");

    ctx.aisdk.hook("language", async (input) => {
      if (input.model?.providerID !== PROVIDER_ID) return;
      const openai = createOpenAI({
        apiKey: getApiKey(),
        baseURL: getBaseUrl(),
      });
      input.language = openai(input.model?.id);
    });
  } catch (err) {
    console.warn("[opencode-clinepass] @ai-sdk/openai not available:", err?.message);
  }

  await ctx.provider.reload();

  console.log("✓ OpenCode Clinepass plugin loaded (V2)");
}

function server(modules) {
  const { hook } = modules || {};
  if (typeof hook === "function") {
    hook("Stop", async ({ messages }) => ({ messages }));
  }
  console.log("✓ OpenCode Clinepass plugin loaded (V1)");
}

export default {
  ...Plugin.define({ id: "opencode-clinepass", setup: setupV2 }),
  server,
};
