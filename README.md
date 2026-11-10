# opencode-clinepass

OpenCode v2 plugin that registers the **Clinepass** provider.

## Install

```bash
npm install opencode-clinepass
```

Add to your OpenCode config:

```jsonc
{
  "plugins": ["opencode-clinepass"]
}
```

## Configuration

Set your API key:

```bash
export CLINEPASS_API_KEY=your_key_here
# or
export CLINE_API_KEY=your_key_here
```

Optional base URL override:

```bash
export CLINEPASS_BASE_URL=https://api.cline.bot/v1
```

## Clinepass API

See https://docs.cline.bot/api/overview for the upstream API documentation.

## License

MIT
```