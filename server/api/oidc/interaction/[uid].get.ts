import {
  createError,
  defineEventHandler,
  getRouterParam,
  sendRedirect,
  setHeader,
} from "h3";
import { planOidcInteraction } from "../../../utils/oidcInteraction";
import { getOidcProvider } from "../../../utils/oidcProvider";

export default defineEventHandler(async (event) => {
  setHeader(event, "Cache-Control", "no-store");
  const provider = await getOidcProvider();
  const details: any = await provider.interactionDetails(event.node.req, event.node.res);
  const uid = getRouterParam(event, "uid");
  if (!uid || uid !== details.uid) {
    throw createError({ statusCode: 400, statusMessage: "Invalid OIDC interaction" });
  }

  const decision = planOidcInteraction(details, event.context.auth ?? null);
  if (decision.type === "redirect") {
    return sendRedirect(event, decision.location, 302);
  }
  if (decision.type === "finish") {
    await provider.interactionFinished(event.node.req, event.node.res, decision.result, {
      mergeWithLastSubmission: false,
    });
    return;
  }

  let grant = details.grantId ? await provider.Grant.find(details.grantId) : undefined;
  grant ??= new provider.Grant({
    accountId: decision.accountId,
    clientId: details.params.client_id,
  });
  if (decision.scopes.length) grant.addOIDCScope(decision.scopes.join(" "));
  if (decision.claims.length) grant.addOIDCClaims(decision.claims);
  const grantId = await grant.save();
  await provider.interactionFinished(event.node.req, event.node.res, {
    consent: { grantId },
  }, { mergeWithLastSubmission: true });
});
