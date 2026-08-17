import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/produk(.*)",
  "/metode(.*)",
  "/artikel(.*)",
  "/cabang(.*)",
  "/kontak",
  "/tentang",
  "/education",
  "/search",
  "/shop",
  "/api/v1/health",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};