import * as fs from "node:fs";
import * as path from "node:path";

const configPath = path.join(
  process.cwd(),
  ".vercel/output/functions/_render.func/.vc-config.json"
);

if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  config.runtime = "nodejs20.x";
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("Fixed Vercel runtime to nodejs20.x");
} else {
  console.log("No .vc-config.json found, skipping");
}
