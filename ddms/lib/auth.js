import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export function parseCookies(req) {
  const header = req.headers?.get ? req.headers.get('cookie') : req.headers?.cookie;
  const list = {};
  if (!header) return list;
  header.split(';').forEach(function (cookie) {
    const parts = cookie.split('=');
    const key = parts.shift().trim();
    const value = decodeURIComponent(parts.join('='));
    list[key] = value;
  });
  return list;
}

export function getTokenFromReq(req) {
  const cookies = parseCookies(req);
  return cookies.token;
}

export function requireAuth(req) {
  const token = getTokenFromReq(req);
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded;
}
