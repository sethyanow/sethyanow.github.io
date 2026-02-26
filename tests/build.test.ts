import { describe, test, expect, beforeAll } from "bun:test";
import { existsSync } from "fs";
import { join } from "path";
import { $ } from "bun";

const distDir = join(import.meta.dir, "..", "dist");

describe("Astro build", () => {
  beforeAll(async () => {
    const result = await $`bun run build`.quiet();
    expect(result.exitCode).toBe(0);
  });

  test("produces dist/ directory", () => {
    expect(existsSync(distDir)).toBe(true);
  });

  test("generates index.html", () => {
    expect(existsSync(join(distDir, "index.html"))).toBe(true);
  });

  test("generates about/index.html", () => {
    expect(existsSync(join(distDir, "about", "index.html"))).toBe(true);
  });

  test("generates projects/index.html", () => {
    expect(existsSync(join(distDir, "projects", "index.html"))).toBe(true);
  });

  test("home page has correct title", async () => {
    const html = await Bun.file(join(distDir, "index.html")).text();
    expect(html).toContain("<title>Home | Seth Yanow</title>");
  });

  test("home page has hero content", async () => {
    const html = await Bun.file(join(distDir, "index.html")).text();
    expect(html).toContain("Seth Yanow");
    expect(html).toContain("Software engineer building tools for developers.");
  });

  test("about page has correct title", async () => {
    const html = await Bun.file(join(distDir, "about", "index.html")).text();
    expect(html).toContain("<title>About | Seth Yanow</title>");
  });

  test("projects page has markymark card", async () => {
    const html = await Bun.file(
      join(distDir, "projects", "index.html")
    ).text();
    expect(html).toContain("markymark");
    expect(html).toContain("/markymark/");
    expect(html).toContain(
      "Markdown workspace indexer with LSP and MCP support"
    );
  });

  test("all pages have nav links", async () => {
    const pages = ["index.html", "about/index.html", "projects/index.html"];
    for (const page of pages) {
      const html = await Bun.file(join(distDir, page)).text();
      expect(html).toContain('href="/"');
      expect(html).toContain('href="/about"');
      expect(html).toContain('href="/projects"');
    }
  });

  test("all pages import Layout (Tailwind CSS present)", async () => {
    const pages = ["index.html", "about/index.html", "projects/index.html"];
    for (const page of pages) {
      const html = await Bun.file(join(distDir, page)).text();
      expect(html).toContain("/_astro/");
      expect(html).toContain('class="min-h-screen');
    }
  });

  test("responsive header markup present", async () => {
    const html = await Bun.file(join(distDir, "index.html")).text();
    expect(html).toContain("md:hidden");
    expect(html).toContain("md:flex");
  });

  test("no non-bun lock files exist", () => {
    const root = join(import.meta.dir, "..");
    expect(existsSync(join(root, "package-lock.json"))).toBe(false);
    expect(existsSync(join(root, "yarn.lock"))).toBe(false);
    expect(existsSync(join(root, "pnpm-lock.yaml"))).toBe(false);
  });
});
