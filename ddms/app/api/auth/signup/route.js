import connectdb from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../../lib/auth';

export async function POST(req) {
  await connectdb();
  const body = await req.json();
  const { name, email, password } = body;

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return new Response(JSON.stringify({ error: 'User exists' }), { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hash });
  await user.save();

  // Optionally sign-in user immediately by setting cookie
  const token = signToken({ id: user._id, email: user.email });
  const secure = process.env.NODE_ENV === 'production';
  const cookie = `token=${token}; Path=/; Max-Age=${7 * 24 * 3600}; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' },
  });
}
