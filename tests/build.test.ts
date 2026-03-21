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
      expect(html).toMatch(/class="[^"]*\bmin-h-screen\b/);
    }
  });

  test("responsive header markup present", async () => {
    const html = await Bun.file(join(distDir, "index.html")).text();
    expect(html).toContain("md:hidden");
    expect(html).toContain("md:flex");
    expect(html).toContain('aria-hidden="true"');
  });

  test("active nav link has aria-current page attribute", async () => {
    const html = await Bun.file(join(distDir, "about/index.html")).text();
    // The About page link should have aria-current="page"
    expect(html).toMatch(/href="\/about"[^>]*aria-current="page"/);
    // Home link should NOT have aria-current on a non-home page
    expect(html).not.toMatch(/href="\/"[^>]*aria-current="page"/);
  });

  test("skip-to-content link exists and targets #main", async () => {
    const html = await Bun.file(join(distDir, "index.html")).text();
    expect(html).toMatch(/href="#main"[^>]*>Skip to content</);
    expect(html).toMatch(/id="main"/);
  });

  test("mobile nav toggle has aria-expanded attribute", async () => {
    const html = await Bun.file(join(distDir, "index.html")).text();
    expect(html).toContain("aria-expanded");
  });

  test("focus-visible styles are defined", async () => {
    const html = await Bun.file(join(distDir, "index.html")).text();
    expect(html).toMatch(/focus-visible/);
  });

  test("external links announce new tab to screen readers", async () => {
    const html = await Bun.file(join(distDir, "index.html")).text();
    // Footer GitHub link should have screen reader text
    expect(html).toMatch(/opens in.{0,10}new tab/i);
  });

  test("homepage has heading hierarchy below h1", async () => {
    const html = await Bun.file(join(distDir, "index.html")).text();
    const h1Index = html.indexOf("<h1");
    const h2Index = html.indexOf("<h2");
    expect(h2Index).toBeGreaterThan(h1Index);
  });

  test("ProjectCard uses specific transition properties, not transition-all", async () => {
    const html = await Bun.file(
      join(distDir, "projects", "index.html")
    ).text();
    // The card link should not use transition-all
    expect(html).not.toMatch(/class="[^"]*\btransition-all\b/);
  });

  test("no non-bun lock files exist", () => {
    const root = join(import.meta.dir, "..");
    expect(existsSync(join(root, "package-lock.json"))).toBe(false);
    expect(existsSync(join(root, "yarn.lock"))).toBe(false);
    expect(existsSync(join(root, "pnpm-lock.yaml"))).toBe(false);
  });
});
