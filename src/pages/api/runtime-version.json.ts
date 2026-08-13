import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ node: process.version }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
