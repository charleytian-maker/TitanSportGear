export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'en';

  const { results } = await env.DB.prepare(
    "SELECT * FROM posts WHERE lang = ? ORDER BY published_at DESC"
  ).bind(lang).all();

  return Response.json(results);
}