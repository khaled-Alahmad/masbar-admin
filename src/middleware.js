import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function middleware(request) {
    const token = cookies().get("token")?.value;


    const protectedRoutes = ["/", "/fqa", "/requests", "/services"];

    if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/fqa/:path*",
        "/requests/:path*",
        "/services/:path*",
        "/services-type/:path*",

        "/service-requests/:path*",

        "/free-services/:path*",

        "/companies/:path*",

        "/invoices/:path*",
        "/service-request-reviews/:path*",
        "/ads/:path*",
        "/clients/:path*",
        "/providers/:path*",
        "/settings/:path*",



    ],
};
