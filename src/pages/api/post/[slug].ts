import { getEntry } from "astro:content";
import { marked } from "marked";

// 서버 측에서만 렌더링되도록 설정
export const prerender = false;

export async function GET({ params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    if (!slug) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "게시물 슬러그가 제공되지 않았습니다.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 특정 슬러그의 블로그 포스트 가져오기
    const post = await getEntry("blog", slug);

    if (!post) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "게시물을 찾을 수 없습니다.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Markdown 컨텐츠를 HTML로 변환
    const htmlContent = marked.parse(post.body);

    // 포스트 데이터와 HTML 컨텐츠 반환
    return new Response(
      JSON.stringify({
        success: true,
        post: {
          slug: post.slug,
          title: post.data.title,
          description: post.data.description,
          pubDatetime: post.data.pubDatetime,
          modDatetime: post.data.modDatetime,
          tags: post.data.tags,
          author: post.data.author,
          featured: post.data.featured || false,
          content: {
            raw: post.body,
            html: htmlContent,
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
  } catch (error) {
    console.error("블로그 포스트를 가져오는 중 오류가 발생했습니다:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "블로그 포스트를 가져오는 중 오류가 발생했습니다.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
