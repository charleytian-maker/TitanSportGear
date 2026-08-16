export async function onRequestPost(context) {
  const { env, request } = context;
  const data = await request.json();

  const { title, slug, content, excerpt, lang, password } = data;

  if (password !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: 'Wrong password' }), { status: 401 });
  }

  if (!title || !slug || !content) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  await env.DB.prepare(
    "INSERT INTO posts (title, slug, content, excerpt, lang) VALUES (?, ?, ?, ?, ?)"
  ).bind(title, slug, content, excerpt || '', lang || 'en').run();

  return Response.json({ success: true });
}