import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/admin", "/dashboard" ];
/* const authRoutes = ["/login"]; */
const secret = process.env.AUTH_SECRET

export default async function middleware(req: NextRequest) {
  const token = await getToken({req, secret}) // La session de await auth(), si tiene fallos, rompe el middleware por eso uso token
  const { nextUrl } = req;

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  /* const isAuthRoute = authRoutes.includes(nextUrl.pathname); */
  
  const res = NextResponse.next();
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: res.headers });
  } 

  if (!!token && nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (!token && isProtected) {
    const absoluteURL = new URL("/", nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  return res
}
