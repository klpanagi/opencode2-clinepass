# opencode-clinepass

OpenCode v2 plugin that registers the **Clinepass** provider.

## Install

```bash
npm install opencode-clinepass
```

```jsonc
// opencode.jsonc
{ "plugins": ["opencode-clinepass"] }
```

## Configure

Run `/connect` in OpenCode and select **Clinepass**, then paste your API key.

Optional base URL override:

```bash
export CLINEPASS_BASE_URL=https://api.cline.bot/v1
```

## Develop

```bash
npm install
npm run lint
npm run build
npm test
```

## License

MIT
