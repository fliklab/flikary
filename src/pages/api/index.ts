export const prerender = false;

export async function GET({ request }: { request: Request }) {
  const host = new URL(request.url).origin;

  return new Response(
    JSON.stringify({
      success: true,
      message: "블로그 API에 오신 것을 환영합니다",
      api: {
        version: "1.0.0",
        endpoints: {
          posts: {
            url: `${host}/api/posts`,
            description: "모든 블로그 포스트 목록을 반환합니다",
          },
          post: {
            url: `${host}/api/post/:slug`,
            description: "특정 슬러그의 블로그 포스트를 반환합니다",
            example: `${host}/api/post/starting-new-blog`,
          },
          pages: {
            url: `${host}/api/pages/:page`,
            description:
              "특정 페이지의 내용을 반환합니다 (resume, self-introduction, about)",
            example: `${host}/api/pages/resume`,
          },
        },
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
