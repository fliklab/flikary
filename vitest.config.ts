/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    environment: "happy-dom",
    include: ["**/*.test.{js,ts}"],
    globals: true,
  },
});
