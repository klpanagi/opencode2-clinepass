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

```bash
export CLINEPASS_API_KEY=your_key_here   # or CLINE_API_KEY
export CLINEPASS_BASE_URL=https://api.cline.bot/v1  # optional
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
