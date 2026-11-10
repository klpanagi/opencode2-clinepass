import { Plugin } from "@opencode/plugin";

const PROVIDER_ID = "clinepass";
const DEFAULT_BASE_URL = "https://api.cline.bot/v1";
const DEFAULT_MODEL_ID = "clinepass-default";

function getApiKey() {
  return process.env.CLINEPASS_API_KEY || process.env.CLINE_API_KEY || "";
}

function getBaseUrl() {
  return process.env.CLINEPASS_BASE_URL || DEFAULT_BASE_URL;
}

async function setupV2(ctx) {
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
      models: [
        {
          id: DEFAULT_MODEL_ID,
          name: "Clinepass Default",
          family: "clinepass",
          providerID: PROVIDER_ID,
          api: {
            id: DEFAULT_MODEL_ID,
            url: getBaseUrl(),
            npm: "@ai-sdk/openai",
          },
          capabilities: {
            temperature: true,
            reasoning: false,
            attachment: false,
            toolCall: true,
          },
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
          limit: { context: 128000, output: 8192 },
        },
      ],
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
      input.language = openai(input.model?.id || DEFAULT_MODEL_ID);
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