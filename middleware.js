export const config = {
  matcher: ['/admin.html', '/admin', '/admin/:path*'],
};

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
  const headers = new Headers();
  headers.set('WWW-Authenticate', 'Basic realm="Admin Palais Mauricien", charset="UTF-8"');
  headers.set('Content-Type', 'text/plain; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response('Authentication required', { status: 401, headers });
}
