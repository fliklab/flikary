import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, FormEvent, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import "./blog-comments.css";

interface SiteComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  githubAuthor: {
    login: string;
    avatarUrl: string;
    url: string;
  } | null;
}

interface CommentsResponse {
  comments: SiteComment[];
}

interface CreateCommentResponse {
  comment: SiteComment;
  error?: string;
}

interface BlogCommentsProps {
  pageId: string;
}

const AUTHOR_STORAGE_KEY = "flikary-comment-author";
const RECENT_DATE_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

function formatDate(value: string): string {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();

  if (diffMs >= 0 && diffMs < RECENT_DATE_THRESHOLD_MS) {
    const diffMinutes = Math.max(1, Math.floor(diffMs / 60_000));

    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }

    return `${Math.floor(diffHours / 24)}일 전`;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

async function readError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data.error ?? "댓글 요청에 실패했습니다.";
  } catch {
    return "댓글 요청에 실패했습니다.";
  }
}

export default function BlogComments({ pageId }: BlogCommentsProps) {
  const authorId = useId();
  const contentId = useId();
  const honeypotId = useId();
  const authorInputRef = useRef<HTMLInputElement | null>(null);
  const [comments, setComments] = useState<SiteComment[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState("");
  const [isEditingAuthor, setIsEditingAuthor] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadComments = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const params = new URLSearchParams({ pageId });
      const response = await fetch(`/api/comments?${params.toString()}`);

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const data = (await response.json()) as CommentsResponse;
      setComments(data.comments);
    } catch (caughtError) {
      setLoadError("댓글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedAuthor = localStorage.getItem(AUTHOR_STORAGE_KEY) ?? "";

    setAuthor(savedAuthor);
    setIsEditingAuthor(!savedAuthor);
    void loadComments();
  }, [pageId]);

  useEffect(() => {
    if (isEditingAuthor) {
      authorInputRef.current?.focus();
    }
  }, [isEditingAuthor]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!author.trim() || !content.trim()) {
      setSubmitError("이름과 댓글을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageId,
          author,
          content,
          website,
        }),
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const data = (await response.json()) as CreateCommentResponse;

      if (data.comment) {
        setComments(current => [...current, data.comment]);
        setContent("");
        localStorage.setItem(AUTHOR_STORAGE_KEY, author.trim());
      }
    } catch (caughtError) {
      setSubmitError(
        "댓글을 저장하지 못했습니다. 입력 내용은 유지했으니 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <section className="blog-comments" aria-labelledby="blog-comments-title">
      <div className="blog-comments__header">
        <h2 id="blog-comments-title" className="blog-comments__title">
          댓글
        </h2>
      </div>

      <form className="blog-comments__form" onSubmit={handleSubmit}>
        <div className="blog-comments__field-row">
          <label className="blog-comments__label" htmlFor={authorId}>
            이름
          </label>
          {isEditingAuthor ? (
            <input
              ref={authorInputRef}
              id={authorId}
              className="blog-comments__input"
              value={author}
              maxLength={40}
              onChange={event => setAuthor(event.target.value)}
              autoComplete="name"
              placeholder="표시 이름"
            />
          ) : (
            <button
              type="button"
              className="blog-comments__author-value"
              onClick={() => setIsEditingAuthor(true)}
            >
              {author}
            </button>
          )}
        </div>

        <div className="blog-comments__field-row blog-comments__field-row--hidden">
          <label className="blog-comments__label" htmlFor={honeypotId}>
            Website
          </label>
          <input
            id={honeypotId}
            className="blog-comments__input"
            value={website}
            onChange={event => setWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="blog-comments__field-row">
          <label className="blog-comments__label" htmlFor={contentId}>
            내용
          </label>
          <textarea
            id={contentId}
            className="blog-comments__textarea"
            value={content}
            maxLength={2000}
            rows={2}
            onChange={event => setContent(event.target.value)}
            onKeyDown={handleContentKeyDown}
            placeholder="생각을 남겨주세요."
          />
        </div>

        <div className="blog-comments__form-footer">
          <span className="blog-comments__count">{content.length}/2000</span>
          <button
            type="submit"
            className="blog-comments__submit"
            disabled={isSubmitting}
          >
            <Send size={16} aria-hidden="true" />
            <span>{isSubmitting ? "저장 중" : "댓글 달기"}</span>
          </button>
        </div>

        {submitError && (
          <p className="blog-comments__error" role="alert">
            {submitError}
          </p>
        )}
      </form>

      <div className="blog-comments__list" aria-live="polite">
        {isLoading ? (
          <p className="blog-comments__status">댓글을 불러오는 중입니다.</p>
        ) : loadError && comments.length === 0 ? (
          <div className="blog-comments__notice" role="status">
            <p>{loadError}</p>
            <button
              type="button"
              className="blog-comments__retry"
              onClick={loadComments}
            >
              다시 불러오기
            </button>
          </div>
        ) : comments.length === 0 ? (
          <p className="blog-comments__status">
            아직 댓글이 없습니다. 첫 댓글을 남겨주세요.
          </p>
        ) : (
          <>
            {loadError && (
              <div className="blog-comments__notice" role="status">
                <p>{loadError}</p>
                <button
                  type="button"
                  className="blog-comments__retry"
                  onClick={loadComments}
                >
                  다시 불러오기
                </button>
              </div>
            )}
            {comments.map((comment, index) => (
              <article
                className="blog-comments__item"
                key={comment.id}
                style={{ "--comment-index": index } as CSSProperties}
              >
                <header className="blog-comments__item-header">
                  <strong className="blog-comments__author">
                    {comment.author}
                  </strong>
                  <time
                    className="blog-comments__date"
                    dateTime={comment.createdAt}
                  >
                    {formatDate(comment.createdAt)}
                  </time>
                </header>
                <p className="blog-comments__content">{comment.content}</p>
              </article>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
