import connectdb from "../../../../lib/mongodb";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";

export async function POST(req) {
  await connectdb();
  const { email, password } = await req.json();
  if (!email || !password)
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });

  const user = await User.findOne({ email });
  if (!user) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

  const token = signToken({ id: user._id, email: user.email, role: user.role });
  const secure = process.env.NODE_ENV === "production";
  const cookie = `token=${token}; Path=/; Max-Age=${7 * 24 * 3600}; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}`;

  return new Response(JSON.stringify({ ok: true, user: { name: user.name, email: user.email, role: user.role } }), {
    status: 200,
    headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
  });
}
