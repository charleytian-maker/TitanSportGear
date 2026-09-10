export async function onRequestPost(context) {
  const { env, request } = context;
  const data = await request.json();

  const { title, slug, content, excerpt, lang, password, image } = data;

if (password !== env.ADMIN_PASSWORD) {
  return new Response(JSON.stringify({ error: 'Wrong password' }), { status: 401 });
}

if (!title || !slug || !content) {
  return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
}

await env.DB.prepare(
  "INSERT INTO posts (title, slug, content, excerpt, lang, image_url) VALUES (?, ?, ?, ?, ?, ?)"
).bind(title, slug, content, excerpt || '', lang || 'en', image || '').run();

return Response.json({ success: true });
}