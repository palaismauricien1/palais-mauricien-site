export const config = {
  matcher: ['/admin.html', '/admin', '/admin/:path*'],
};

const REALM = 'Palais Mauricien — Espace administrateur';
const PASSWORD = 'luqman2024';

export default function middleware(request) {
  const auth = request.headers.get('authorization');
  if (auth && auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const idx = decoded.indexOf(':');
      const pwd = idx >= 0 ? decoded.slice(idx + 1) : decoded;
      if (pwd === PASSWORD) return;
    } catch (_) {}
  }
  return new Response('Authentification requise', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}"`,
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
