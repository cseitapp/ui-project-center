# CSE Community

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production authentication configuration

Community authentication settings are private runtime configuration. Never put
real values in source control or copy an environment file into the container
image.

Required runtime variables:

```dotenv
# Generate a unique random secret of at least 32 characters.
NUXT_SESSION_PASSWORD=
NUXT_AUTH_COOKIE_NAME=community-session
NUXT_COOKIE_LIFE=86400
```

All values used by Nuxt runtime configuration must use their `NUXT_` names in
`.env.production`; the file is injected by Compose when the container starts
and is never copied into the image. Use `.env.example` as the complete key
list. Private upstream values such as `NUXT_PROJECT_CENTER_API_KEY` must never
use a `NUXT_PUBLIC_` prefix.

During the legacy-cookie migration, set `NUXT_LEGACY_AUTH_COOKIE_NAME` and
`NUXT_DOMAIN` to the old cookie name and its exact Domain attribute (for
example `.cselao.la`). This lets Community expire both host-only and
parent-domain legacy cookies. New `community-session` cookies remain host-only.

Community stores login sessions in server memory. Run a single API process;
sessions are not shared across replicas and are lost on restart or deployment.
Users must log in again after a restart. Expired sessions are removed when read
or when a new session is created.

Authentication cookies are host-only, HttpOnly, `SameSite=Lax`, and require
HTTPS in production. The reverse proxy must terminate TLS before production
traffic reaches this service.

## Production build

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
