import { requireAuth } from '../../../../lib/auth';

export async function GET(req){
  const decoded = requireAuth(req);
  if (!decoded) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  return new Response(JSON.stringify({ user: { id: decoded.id, email: decoded.email } }), { status: 200 });
}
