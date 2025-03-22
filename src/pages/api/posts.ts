import { getCollection, type CollectionEntry } from "astro:content";

// 서버 측에서만 렌더링되도록 설정
export const prerender = false;

export async function GET() {
  try {
    // 모든 블로그 포스트 가져오기
    const posts = await getCollection("blog");

    // 초안(draft)이 아닌 포스트만 필터링하고 날짜순으로 정렬
    const publishedPosts = posts
      .filter((post: CollectionEntry<"blog">) => !post.data.draft)
      .sort(
        (a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
          new Date(b.data.pubDatetime).valueOf() -
          new Date(a.data.pubDatetime).valueOf()
      )
      .map((post: CollectionEntry<"blog">) => ({
        slug: post.slug,
        title: post.data.title,
        description: post.data.description,
        pubDatetime: post.data.pubDatetime,
        tags: post.data.tags,
        author: post.data.author,
        featured: post.data.featured || false,
      }));

    return new Response(
      JSON.stringify({
        success: true,
        posts: publishedPosts,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "블로그 포스트 목록을 가져오는 중 오류가 발생했습니다:",
      error
    );
    return new Response(
      JSON.stringify({
        success: false,
        message: "블로그 포스트 목록을 가져오는 중 오류가 발생했습니다.",
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
