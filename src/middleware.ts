import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

//  User must be logged in to view certain pages
export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    if (!token) {
        return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
    }
}

export const config = {
    matcher: ["/u/profile", "/b/:path*", "/w/:path*"],
}