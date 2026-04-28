import type { APIRoute } from "astro";
import { addComment, listComments } from "../../server/comments/githubComments";

export const prerender = false;

const MAX_PAGE_ID_LENGTH = 180;
const MAX_AUTHOR_LENGTH = 40;
const MAX_CONTENT_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

function getClientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(request: Request): boolean {
  const key = getClientKey(request);
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

function validatePageId(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const pageId = value.trim();
  if (!pageId || pageId.length > MAX_PAGE_ID_LENGTH) return null;
  if (pageId.includes("..") || /[\u0000-\u001f]/.test(pageId)) return null;

  return pageId;
}

function validateText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;

  const text = value.trim();
  if (!text || text.length > maxLength) return null;

  return text;
}

export const GET: APIRoute = async ({ url }) => {
  const pageId = validatePageId(url.searchParams.get("pageId"));

  if (!pageId) {
    return jsonResponse({ error: "Invalid pageId" }, { status: 400 });
  }

  try {
    const comments = await listComments(pageId);
    return jsonResponse({ comments }, { status: 200 });
  } catch (error) {
    console.error("Failed to list comments", error);
    return jsonResponse({ error: "Failed to list comments" }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (isRateLimited(request)) {
    return jsonResponse({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const payload = await request.json();

    if (payload.website) {
      return jsonResponse({ ok: true }, { status: 200 });
    }

    const pageId = validatePageId(payload.pageId);
    const author = validateText(payload.author, MAX_AUTHOR_LENGTH);
    const content = validateText(payload.content, MAX_CONTENT_LENGTH);

    if (!pageId || !author || !content) {
      return jsonResponse({ error: "Invalid comment input" }, { status: 400 });
    }

    const comment = await addComment({ pageId, author, content });
    return jsonResponse({ comment }, { status: 201 });
  } catch (error) {
    console.error("Failed to add comment", error);
    return jsonResponse({ error: "Failed to add comment" }, { status: 500 });
  }
};

export const ALL: APIRoute = async () =>
  jsonResponse({ error: "Method not allowed" }, { status: 405 });
