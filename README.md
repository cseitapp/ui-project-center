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
NUXT_REDIS_URL=redis://redis:6379
NUXT_SESSION_PREFIX=community:session:
NUXT_OIDC_ADAPTER_PREFIX=community:oidc:
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

Community stores login sessions and OIDC provider state in the private Redis
service declared by Compose. Redis persistence allows sessions and in-flight
authorization state to survive API restarts and be shared by multiple API
replicas. Do not publish the Redis port or fall back to process-local memory.
The first deployment of this migration invalidates the former in-memory
sessions, so users must log in once after deployment.

Authentication cookies are host-only, HttpOnly, `SameSite=Lax`, and require
HTTPS in production. The reverse proxy must terminate TLS before production
traffic reaches this service.

## OIDC provider for first-party systems

Community is the OIDC provider for E-Document. It supports Authorization Code
flow only, requires PKCE S256, and maps the stable `USER_NAME` value to the OIDC
`sub` and `preferred_username` claims. Configure these private runtime values:

```dotenv
NUXT_OIDC_ISSUER=https://community.cselao.la
NUXT_OIDC_KEY_ID=community-rs256-yyyy-mm
NUXT_OIDC_PRIVATE_KEY_BASE64=<base64-encoded PKCS8 RSA private key>
NUXT_OIDC_CODE_LIFETIME=60
NUXT_OIDC_CLIENT_EDOCUMENT_ID=edocument
NUXT_OIDC_CLIENT_EDOCUMENT_SECRET=<unique random client secret>
NUXT_OIDC_CLIENT_EDOCUMENT_REDIRECT_URI=https://edocument.cselao.la/api/auth/oidc/callback
```

The issuer must be Community's exact public HTTPS origin and the redirect URI
must exactly match the E-Document runtime configuration. Keep signing keys and
client secrets in the deployment secret manager; never commit, expose through
`runtimeConfig.public`, bake into images, or print authorization codes, cookies,
secrets, tokens, PKCE values, or session data to logs.

The pilot provider publishes one signing key. Rotate it during a coordinated
maintenance window and expect in-flight authorizations to restart. Implement a
multi-key JWKS plus an active `kid` before requiring zero-downtime signing-key
rotation. For client-secret rotation, coordinate the same new value across
Community and E-Document; in-flight authorizations may need to restart. Manual
E-Document password login is the phase-one rollback if
the provider is disabled or unavailable. Community logout remains independent
from E-Document logout until coordinated single logout is implemented.

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
