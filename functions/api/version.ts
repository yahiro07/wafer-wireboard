export async function onRequest(context: { env: { CF_PAGES_URL?: string } }) {
  const cfPagesUrl = context.env.CF_PAGES_URL || "local-dev";
  return new Response(JSON.stringify({ cfPagesUrl }), {
    headers: { "Content-Type": "application/json" },
  });
}
