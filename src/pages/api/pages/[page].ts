import fs from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import matter from "gray-matter";

// 서버 측에서만 렌더링되도록 설정
export const prerender = false;

export async function GET({ params }: { params: { page: string } }) {
  try {
    const { page } = params;

    if (!page) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "페이지 이름이 제공되지 않았습니다.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 지원하는 페이지 타입 목록
    const supportedPages = ["resume", "self-introduction", "about"];

    if (!supportedPages.includes(page)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "지원하지 않는 페이지 타입입니다.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 특정 페이지 파일 경로
    const filePath = path.join(process.cwd(), "src", "pages", `${page}.md`);

    // 파일 읽기
    const fileContent = await fs.readFile(filePath, "utf-8");

    // frontmatter와 마크다운 내용 분리
    const { data: frontmatter, content } = matter(fileContent);

    // 마크다운을 HTML로 변환
    const htmlContent = marked.parse(content);

    return new Response(
      JSON.stringify({
        success: true,
        page: {
          title: frontmatter.title || page,
          frontmatter,
          content: {
            raw: content,
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
    console.error(`페이지 정보를 가져오는 중 오류가 발생했습니다: ${error}`);

    return new Response(
      JSON.stringify({
        success: false,
        message: "페이지 정보를 가져오는 중 오류가 발생했습니다.",
        error: String(error),
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
