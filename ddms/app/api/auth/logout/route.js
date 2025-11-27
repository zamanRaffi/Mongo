export async function POST() {
  const cookie = `token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
  });
}
