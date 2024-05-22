import { NextResponse } from "next/server";
import { verifyJwtToken } from "./app/auth/validateToken";

export async function middleware(request) {

    const { pathname } = request.nextUrl;

    // List of public routes
    const publicRoutes = ['/auth/login', '/api/auth/login', '/auth/validateToken'];

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    let token = request.cookies.get('token')?.value;

    if (!token) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next()

    // const result = await verifyJwtToken(token);
    // if (!result) {
    //     return NextResponse.redirect(new URL('/auth/login', request.url));
    // } else {
    //     return NextResponse.next()
    // }
}

export const config = {
    matcher: [
        '/',
        '/api',
        '/ccs',
        '/ccs/novo',
        '/pix',
        '/pix/novo',
        '/components',
        '/dashboard',
        '/formLab',
        '/user'
    ]
}