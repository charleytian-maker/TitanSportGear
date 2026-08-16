 export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare(
    "SELECT * FROM posts ORDER BY published_at DESC"
  ).all();
  return Response.json(results);
}