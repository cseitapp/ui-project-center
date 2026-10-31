type ErrorRendererOptions = {
  clientId: string;
  redirectUri: string;
};

type OidcErrorContext = {
  path?: string;
  query?: Record<string, unknown>;
  type?: string;
  body?: string;
  redirect?: (location: string) => unknown;
};

export function createOidcErrorRenderer(options: ErrorRendererOptions) {
  return async function renderOidcError(
    ctx: OidcErrorContext,
    _output: Record<string, unknown>,
  ) {
    const query = ctx.query ?? {};
    const validAuthorizationRequest = ctx.path === "/oauth/authorize" &&
      query.client_id === options.clientId &&
      query.redirect_uri === options.redirectUri &&
      typeof query.state === "string" &&
      query.state.length > 0 &&
      typeof ctx.redirect === "function";

    if (validAuthorizationRequest) {
      const callback = new URL(options.redirectUri);
      callback.searchParams.set("error", "server_error");
      callback.searchParams.set("state", query.state as string);
      ctx.redirect!(callback.href);
      return;
    }

    ctx.type = "html";
    ctx.body = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><title>Authorization failed</title></head>
  <body><main><h1>Authorization failed</h1><p>Please return to the application and try again.</p></main></body>
</html>`;
  };
}
