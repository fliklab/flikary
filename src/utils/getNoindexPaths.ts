import fs from "fs";
import path from "path";

export function getNoindexPaths(): string[] {
  // Node.js 환경에서만 동작 (SSR)
  if (typeof window === "undefined") {
    try {
      const noindexFile = path.join(process.cwd(), ".noindex");
      if (fs.existsSync(noindexFile)) {
        const content = fs.readFileSync(noindexFile, "utf-8");
        return content.split("\n").filter((line: string) => line.trim() !== "");
      }
    } catch (error) {
      console.error("Error reading .noindex file:", error);
    }
  }
  return [];
}
