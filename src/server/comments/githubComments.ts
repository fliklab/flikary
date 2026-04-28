const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const DISCUSSION_TITLE_PREFIX = "Comments for page:";
const DISCUSSION_LOOKUP_LIMIT = 100;
const COMMENT_PAGE_SIZE = 50;

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  category: string;
}

interface GitHubAuthor {
  login: string;
  avatarUrl: string;
  url: string;
}

interface GitHubCommentNode {
  id: string;
  body: string;
  createdAt: string;
  author: GitHubAuthor | null;
}

export interface SiteComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  githubAuthor: GitHubAuthor | null;
}

interface RepositoryInfo {
  repositoryId: string;
  categoryId: string;
}

function getRequiredEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

function getConfig(): GitHubConfig {
  return {
    token: getRequiredEnv("GITHUB_COMMENT_TOKEN"),
    owner: getRequiredEnv("GITHUB_COMMENT_REPO_OWNER"),
    repo: getRequiredEnv("GITHUB_COMMENT_REPO_NAME"),
    category: getRequiredEnv("GITHUB_COMMENT_DISCUSSION_CATEGORY"),
  };
}

async function fetchGitHubApi<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const config = getConfig();
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `bearer ${config.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
      });

      const payload = await response.json();

      if (!response.ok || payload.errors?.length) {
        const message =
          payload.errors?.[0]?.message ??
          `GitHub API request failed with ${response.status}`;
        throw new Error(message);
      }

      return payload.data as T;
    } catch (error) {
      lastError = error;

      if (attempt === 0) {
        await new Promise(resolve => setTimeout(resolve, 350));
      }
    }
  }

  throw lastError;
}

function getDiscussionTitle(pageId: string): string {
  return `${DISCUSSION_TITLE_PREFIX} ${pageId}`;
}

function buildDiscussionBody(pageId: string): string {
  return [
    "This discussion stores comments for a flikary page.",
    "",
    `Page ID: \`${pageId}\``,
  ].join("\n");
}

function formatCommentBody(author: string, content: string): string {
  return [`**Author:** ${author}`, "", content].join("\n");
}

function parseCommentBody(
  body: string
): Pick<SiteComment, "author" | "content"> {
  const normalized = body.replace(/\r\n/g, "\n");
  const match = normalized.match(/^\*\*Author:\*\*\s*(.+)\n\n([\s\S]*)$/);

  if (!match) {
    return {
      author: "익명",
      content: normalized.trim(),
    };
  }

  return {
    author: match[1].trim() || "익명",
    content: match[2].trim(),
  };
}

async function getRepositoryInfo(): Promise<RepositoryInfo> {
  const config = getConfig();
  const data = await fetchGitHubApi<{
    repository: {
      id: string;
      discussionCategories: {
        nodes: Array<{ id: string; slug: string }>;
      };
    } | null;
  }>(
    `
      query RepositoryInfo($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          id
          discussionCategories(first: 100) {
            nodes {
              id
              slug
            }
          }
        }
      }
    `,
    {
      owner: config.owner,
      name: config.repo,
    }
  );

  if (!data.repository) {
    throw new Error(
      `GitHub comments repository not found: ${config.owner}/${config.repo}`
    );
  }

  const category = data.repository.discussionCategories.nodes.find(
    node => node.slug === config.category
  );

  if (!category) {
    throw new Error(`GitHub discussion category not found: ${config.category}`);
  }

  return {
    repositoryId: data.repository.id,
    categoryId: category.id,
  };
}

async function findDiscussionId(pageId: string): Promise<string | null> {
  const config = getConfig();
  const { categoryId } = await getRepositoryInfo();
  const title = getDiscussionTitle(pageId);

  const data = await fetchGitHubApi<{
    repository: {
      discussions: {
        nodes: Array<{ id: string; title: string }>;
      };
    } | null;
  }>(
    `
      query FindDiscussion(
        $owner: String!
        $name: String!
        $categoryId: ID!
        $limit: Int!
      ) {
        repository(owner: $owner, name: $name) {
          discussions(
            first: $limit
            categoryId: $categoryId
            orderBy: { field: CREATED_AT, direction: DESC }
          ) {
            nodes {
              id
              title
            }
          }
        }
      }
    `,
    {
      owner: config.owner,
      name: config.repo,
      categoryId,
      limit: DISCUSSION_LOOKUP_LIMIT,
    }
  );

  return (
    data.repository?.discussions.nodes.find(node => node.title === title)?.id ??
    null
  );
}

async function createDiscussion(pageId: string): Promise<string> {
  const { repositoryId, categoryId } = await getRepositoryInfo();
  const data = await fetchGitHubApi<{
    createDiscussion: {
      discussion: {
        id: string;
      };
    };
  }>(
    `
      mutation CreateDiscussion(
        $repositoryId: ID!
        $categoryId: ID!
        $title: String!
        $body: String!
      ) {
        createDiscussion(input: {
          repositoryId: $repositoryId
          categoryId: $categoryId
          title: $title
          body: $body
        }) {
          discussion {
            id
          }
        }
      }
    `,
    {
      repositoryId,
      categoryId,
      title: getDiscussionTitle(pageId),
      body: buildDiscussionBody(pageId),
    }
  );

  return data.createDiscussion.discussion.id;
}

async function getOrCreateDiscussionId(pageId: string): Promise<string> {
  const existingDiscussionId = await findDiscussionId(pageId);
  return existingDiscussionId ?? createDiscussion(pageId);
}

export async function listComments(pageId: string): Promise<SiteComment[]> {
  const discussionId = await findDiscussionId(pageId);

  if (!discussionId) {
    return [];
  }

  const data = await fetchGitHubApi<{
    node: {
      comments: {
        nodes: GitHubCommentNode[];
      };
    } | null;
  }>(
    `
      query ListComments($discussionId: ID!, $limit: Int!) {
        node(id: $discussionId) {
          ... on Discussion {
            comments(first: $limit) {
              nodes {
                id
                body
                createdAt
                author {
                  login
                  avatarUrl
                  url
                }
              }
            }
          }
        }
      }
    `,
    {
      discussionId,
      limit: COMMENT_PAGE_SIZE,
    }
  );

  return (
    data.node?.comments.nodes.map(comment => {
      const parsed = parseCommentBody(comment.body);

      return {
        id: comment.id,
        author: parsed.author,
        content: parsed.content,
        createdAt: comment.createdAt,
        githubAuthor: comment.author,
      };
    }) ?? []
  );
}

export async function addComment(input: {
  pageId: string;
  author: string;
  content: string;
}): Promise<SiteComment> {
  const discussionId = await getOrCreateDiscussionId(input.pageId);
  const body = formatCommentBody(input.author, input.content);

  const data = await fetchGitHubApi<{
    addDiscussionComment: {
      comment: GitHubCommentNode;
    };
  }>(
    `
      mutation AddDiscussionComment($discussionId: ID!, $body: String!) {
        addDiscussionComment(input: {
          discussionId: $discussionId
          body: $body
        }) {
          comment {
            id
            body
            createdAt
            author {
              login
              avatarUrl
              url
            }
          }
        }
      }
    `,
    {
      discussionId,
      body,
    }
  );

  const parsed = parseCommentBody(data.addDiscussionComment.comment.body);

  return {
    id: data.addDiscussionComment.comment.id,
    author: parsed.author,
    content: parsed.content,
    createdAt: data.addDiscussionComment.comment.createdAt,
    githubAuthor: data.addDiscussionComment.comment.author,
  };
}
