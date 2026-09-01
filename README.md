# Horizen Documentation

Source for [docs.horizen.io](https://docs.horizen.io) — developer documentation for Horizen, an EVM-identical L3 on Base using the OP Stack.

## Local Development

```bash
npm install
npm run start
```

> Search does not work in dev mode — run `npm run build && npm run serve` to test search locally.

## Environment Variables

Create a `.env` file at the root with your Algolia credentials (used by Docusaurus at build time):

```
ALGOLIA_APP_ID=
ALGOLIA_API_KEY=
ALGOLIA_INDEX_NAME=
```

### Testing Cloudflare Pages Functions locally

The newsletter subscription endpoint (`/api/subscribe`) runs as a Cloudflare Pages Function and requires separate tooling to test locally — Docusaurus's dev server does not execute these functions.

1. Copy the example vars file and fill in your values:

```bash
cp .dev.vars.example .dev.vars
```

`.dev.vars` is gitignored and never committed. Get the real values from the Cloudflare Pages dashboard under **Settings → Environment Variables**.

2. Build the site and start Wrangler's local Pages dev server:

```bash
npm run build
npx wrangler pages dev ./build
```

The site and all API endpoints are then available at `http://localhost:8788`.

## Contributing

1. Fork the repo and create a branch
2. Make your changes under `docs/`
3. Run `npm run start` to preview
4. Open a pull request against `main`

## Build

```bash
npm run build
```

Outputs to `/build`. The LLM discovery files (`/llms.txt`, `/llms-full.txt`, `/llms-ctx.txt`) are generated automatically at build time.
