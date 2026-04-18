import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'teamtasker_auth';
const AUTH_ROUTES = new Set(['/login', '/register', '/forgot-password', '/reset-password']);
const PROTECTED_ROUTE_PREFIXES = ['/dashboard', '/tasks', '/projects', '/team', '/profile', '/development', '/communication', '/admin'];
const ADMIN_ROUTE_PREFIXES = ['/admin'];

interface AccessTokenPayload {
  exp?: number;
  role?: string;
}

const decodeBase64Url = (input: string): string | null => {
  try {
    const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((input.length + 3) % 4);
    return atob(padded);
  } catch {
    return null;
  }
};

const parseAccessTokenPayload = (token: string | undefined): AccessTokenPayload | null => {
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const payloadJson = decodeBase64Url(parts[1]!);
  if (!payloadJson) {
    return null;
  }

  try {
    return JSON.parse(payloadJson) as AccessTokenPayload;
  } catch {
    return null;
  }
};

const isLiveAccessToken = (payload: AccessTokenPayload | null): boolean => {
  if (!payload || typeof payload.exp !== 'number') {
    return false;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp > nowSeconds;
};

const hasAdminRole = (payload: AccessTokenPayload | null): boolean => {
  return (payload?.role || '').toLowerCase() === 'admin';
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = parseAccessTokenPayload(token);
  const isAuthenticated = isLiveAccessToken(payload);

  if (AUTH_ROUTES.has(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const isProtectedRoute = pathname === '/' || PROTECTED_ROUTE_PREFIXES.some(prefix => pathname.startsWith(prefix));
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const isAdminRoute = ADMIN_ROUTE_PREFIXES.some(prefix => pathname.startsWith(prefix));
  if (isAdminRoute && !hasAdminRole(payload)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
