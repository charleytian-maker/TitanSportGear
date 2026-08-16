export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  const lang = url.searchParams.get('lang') || 'en';

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 });
  }

  const post = await env.DB.prepare(
    "SELECT * FROM posts WHERE slug = ? AND lang = ?"
  ).bind(slug, lang).first();

  if (!post) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  return Response.json(post);
}