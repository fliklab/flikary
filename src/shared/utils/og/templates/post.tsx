import satori from "satori";
import type { CollectionEntry } from "astro:content";
import { loadGoogleFonts, type FontOptions } from "@utils/og/fonts";
import { getFeedComputedMeta } from "@utils/content/feed";

const TITLE_MAX_LINES = 3;
const TITLE_SINGLE_LINE_UNITS = 14;
const TITLE_MULTI_LINE_UNITS = 20;
const TAG_MAX_LINES = 2;
const TAG_MAX_UNITS = 26;
const PUNCTUATION_REGEX = /[.,!?;:·ㆍ،，。！？；：]/;

function splitLongToken(token: string, maxUnits: number): string[] {
  if (!token) return [];

  const segments: string[] = [];
  let current = "";

  for (const char of token) {
    if ((current + char).length > maxUnits && current) {
      segments.push(current);
      current = char;
      continue;
    }

    current += char;
  }

  if (current) {
    segments.push(current);
  }

  return segments;
}

function stringifyLine(tokens: string[]): string {
  return tokens.join(" ");
}

function countPunctuationNearBoundary(left: string, right: string): number {
  const leftTrimmed = left.trimEnd();
  const rightTrimmed = right.trimStart();
  const leftLastChar = leftTrimmed[leftTrimmed.length - 1] ?? "";
  const rightFirstChar = rightTrimmed[0] ?? "";

  return (
    Number(PUNCTUATION_REGEX.test(leftLastChar)) +
    Number(PUNCTUATION_REGEX.test(rightFirstChar))
  );
}

function buildBalancedLines(tokens: string[], lineCount: number): string[] {
  let bestLines: string[] | null = null;
  let bestScore = Number.POSITIVE_INFINITY;
  const totalLength = stringifyLine(tokens).length;
  const targetLength = totalLength / lineCount;

  const search = (startIndex: number, currentLines: string[]) => {
    const remainingTokens = tokens.length - startIndex;
    const remainingLines = lineCount - currentLines.length;

    if (remainingLines <= 0) {
      if (startIndex >= tokens.length) {
        const lengths = currentLines.map(line => line.length);
        const balancePenalty = lengths.reduce(
          (sum, length) => sum + Math.abs(length - targetLength),
          0
        );
        const boundaryBonus = currentLines
          .slice(0, -1)
          .reduce((sum, line, index) => {
            return (
              sum -
              countPunctuationNearBoundary(line, currentLines[index + 1]) * 30
            );
          }, 0);
        const score = balancePenalty * 100 + boundaryBonus;

        if (score < bestScore) {
          bestScore = score;
          bestLines = currentLines;
        }
      }
      return;
    }

    if (remainingTokens < remainingLines) {
      return;
    }

    const maxEndExclusive = tokens.length - (remainingLines - 1);
    for (
      let endIndex = startIndex + 1;
      endIndex <= maxEndExclusive;
      endIndex += 1
    ) {
      const nextLine = stringifyLine(tokens.slice(startIndex, endIndex));
      search(endIndex, [...currentLines, nextLine]);
    }
  };

  search(0, []);

  return bestLines ?? [stringifyLine(tokens)];
}

function scorePartition(
  lines: string[],
  maxUnits: number,
  targetLineCount: number
): number {
  const lengths = lines.map(line => line.length);
  const overflowPenalty = lengths.reduce(
    (sum, length) => sum + Math.max(0, length - maxUnits),
    0
  );
  const lineCountPenalty = Math.abs(lines.length - targetLineCount);
  const balancePenalty =
    lengths.length > 1
      ? Math.max(...lengths) - Math.min(...lengths)
      : (lengths[0] ?? 0);

  return overflowPenalty * 10_000 + lineCountPenalty * 100 + balancePenalty;
}

function wrapKeepAllText(
  text: string,
  maxLines: number,
  maxUnits: number
): { lines: string[]; truncated: boolean } {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) return { lines: [], truncated: false };

  const tokens = normalized
    .split(" ")
    .flatMap(token => splitLongToken(token, maxUnits));
  const totalLength = normalized.length;

  if (totalLength <= maxUnits) {
    return { lines: [normalized], truncated: false };
  }

  for (let lineCount = 2; lineCount <= maxLines; lineCount += 1) {
    const candidateLines = buildBalancedLines(tokens, lineCount);
    if (candidateLines.every(line => line.length <= maxUnits)) {
      return { lines: candidateLines, truncated: false };
    }
  }

  const targetLineCount = maxLines;

  let bestLines: string[] | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  const search = (startIndex: number, currentLines: string[]) => {
    if (currentLines.length > maxLines) {
      return;
    }

    if (startIndex >= tokens.length) {
      const score = scorePartition(currentLines, maxUnits, targetLineCount);
      if (score < bestScore) {
        bestScore = score;
        bestLines = currentLines;
      }
      return;
    }

    for (
      let endIndex = startIndex + 1;
      endIndex <= tokens.length;
      endIndex += 1
    ) {
      const nextLine = stringifyLine(tokens.slice(startIndex, endIndex));
      search(endIndex, [...currentLines, nextLine]);
    }
  };

  search(0, []);

  const lines = bestLines ?? [normalized];
  const truncated = lines.some(line => line.length > maxUnits);

  return { lines, truncated };
}

function clampLastLine(
  lines: string[],
  maxUnits: number,
  forceEllipsis = false
): string[] {
  if (lines.length === 0) return lines;

  const result = [...lines];
  const lastIndex = result.length - 1;
  const lastLine = result[lastIndex];

  if (!forceEllipsis && lastLine.length <= maxUnits) {
    return result;
  }

  const clipped = lastLine.slice(0, Math.max(0, maxUnits - 1)).trimEnd();
  result[lastIndex] = `${clipped}…`;
  return result;
}

function buildTitleLines(title: string): string[] {
  const normalized = title.trim().replace(/\s+/g, " ");

  if (normalized.length <= TITLE_SINGLE_LINE_UNITS) {
    return [normalized];
  }

  const { lines, truncated } = wrapKeepAllText(
    normalized,
    TITLE_MAX_LINES,
    TITLE_MULTI_LINE_UNITS
  );
  return clampLastLine(lines, TITLE_MULTI_LINE_UNITS, truncated);
}

function buildTagLines(tags: string[]): string[] {
  const prefixed = tags.map(tag => `#${tag.trim()}`).filter(Boolean);
  const { lines, truncated } = wrapKeepAllText(
    prefixed.join(" "),
    TAG_MAX_LINES,
    TAG_MAX_UNITS
  );
  return clampLastLine(lines, TAG_MAX_UNITS, truncated);
}

type PostOgInput = {
  collection: "blog" | "feed";
  title: string;
  tags: string[];
};

export async function renderPostOgImage({
  collection,
  title,
  tags,
}: PostOgInput) {
  const titleLines = buildTitleLines(title);
  const tagLines = buildTagLines(tags);
  const accentColors =
    collection === "feed"
      ? {
          base: "#eef4ff",
          glowA: "rgba(133, 181, 255, 0.34)",
          glowB: "rgba(255, 190, 210, 0.28)",
          label: "Feed",
        }
      : {
          base: "#f6f1ee",
          glowA: "rgba(255, 205, 163, 0.32)",
          glowB: "rgba(255, 179, 210, 0.24)",
          label: "Blog",
        };

  return satori(
    <div
      style={{
        background: accentColors.base,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-120px",
          left: "-100px",
          width: "500px",
          height: "500px",
          borderRadius: "9999px",
          background: accentColors.glowA,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: "-60px",
          bottom: "-140px",
          width: "440px",
          height: "440px",
          borderRadius: "9999px",
          background: accentColors.glowB,
        }}
      />

      <div
        style={{
          width: "1096px",
          height: "506px",
          borderRadius: "56px",
          background: "rgba(255, 255, 255, 0.52)",
          border: "1px solid rgba(255, 255, 255, 0.75)",
          boxShadow: "0 16px 48px rgba(125, 144, 177, 0.12)",
          display: "flex",
          flexDirection: "column",
          padding: "54px 64px 44px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "18px",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: "rgba(49, 58, 77, 0.55)",
            fontFamily: "IBM Plex Sans KR",
          }}
        >
          {accentColors.label}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {titleLines.map((line, index) => (
            <div
              key={`title-${index}`}
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                width: "100%",
                fontFamily: "NanumBarunPen",
                fontSize: titleLines.length >= 3 ? 76 : 84,
                lineHeight: 1.18,
                color: "#1f2940",
                marginTop: index === 0 ? "0" : "6px",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "92px",
            marginTop: "18px",
          }}
        >
          {tagLines.map((line, index) => (
            <div
              key={`tag-${index}`}
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                width: "100%",
                fontFamily: "NanumBarunPen",
                fontSize: 38,
                lineHeight: 1.22,
                color: "rgba(31, 41, 64, 0.78)",
                marginTop: index === 0 ? "0" : "4px",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div
          style={{
            width: "100%",
            height: "1px",
            marginTop: "12px",
            background:
              "repeating-linear-gradient(90deg, rgba(160, 180, 213, 0.3) 0 8px, transparent 8px 14px)",
          }}
        />
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: (await loadGoogleFonts(
        [title, ...tags, accentColors.label].join(" ")
      )) as FontOptions[],
    }
  );
}

export default async (
  post: CollectionEntry<"blog"> | CollectionEntry<"feed">
) => {
  const title =
    post.collection === "feed"
      ? getFeedComputedMeta(post).resolvedTitle
      : post.data.title;

  return renderPostOgImage({
    collection: post.collection,
    title,
    tags: post.data.tags ?? [],
  });
};
