import connectdb from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { verifyToken } from "../../../../lib/auth";

export async function GET(req) {
  await connectdb();
  const token = req.cookies.get("token")?.value;
  if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const user = await User.findById(decoded.id).select("-password");
  if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

  return new Response(JSON.stringify({ user }));
}
