import { describe, test, expect, beforeAll } from "bun:test";
import { parse } from "yaml";
import { join } from "path";

const workflowPath = join(
  import.meta.dir,
  "..",
  ".github",
  "workflows",
  "deploy.yml"
);

describe("Deploy workflow", () => {
  let workflow: any;

  beforeAll(async () => {
    const content = await Bun.file(workflowPath).text();
    workflow = parse(content);
  });

  test("only trigger is workflow_dispatch", () => {
    const triggers = Object.keys(workflow.on || workflow.true || {});
    expect(triggers).toEqual(["workflow_dispatch"]);
  });

  test("uses oven-sh/setup-bun, not actions/setup-node", () => {
    const yaml = JSON.stringify(workflow);
    expect(yaml).toContain("oven-sh/setup-bun");
    expect(yaml).not.toContain("actions/setup-node");
  });

  test("checks out sethyanow/markymark repository", () => {
    const yaml = JSON.stringify(workflow);
    expect(yaml).toContain("sethyanow/markymark");
  });

  test("has required permissions", () => {
    const job = workflow.jobs?.build ?? workflow.jobs?.deploy;
    const perms = job?.permissions ?? workflow.permissions;
    expect(perms?.pages).toBe("write");
    expect(perms?.["id-token"]).toBe("write");
  });

  test("uses upload-pages-artifact and deploy-pages", () => {
    const yaml = JSON.stringify(workflow);
    expect(yaml).toContain("actions/upload-pages-artifact");
    expect(yaml).toContain("actions/deploy-pages");
  });

  test("assembles _site/markymark path", () => {
    const yaml = JSON.stringify(workflow);
    expect(yaml).toContain("_site/markymark");
  });

  test("has no npm/npx/node commands", () => {
    const yaml = JSON.stringify(workflow);
    expect(yaml).not.toMatch(/\bnpm\b/);
    expect(yaml).not.toMatch(/\bnpx\b/);
    // Allow "node" in "setup-node" context check (already forbidden above)
    // but verify no "node " run commands
    expect(yaml).not.toContain("node ");
  });

  test("has concurrency group", () => {
    const job = workflow.jobs?.build ?? workflow.jobs?.deploy;
    const concurrency = job?.concurrency ?? workflow.concurrency;
    expect(concurrency).toBeDefined();
    expect(concurrency?.["cancel-in-progress"]).toBe(false);
  });

  test("deploy step has id: deployment", () => {
    const yaml = JSON.stringify(workflow);
    expect(yaml).toContain('"id":"deployment"');
  });

  test("uses bun run build:prod for markymark docs", () => {
    const yaml = JSON.stringify(workflow);
    expect(yaml).toContain("build:prod");
  });
});
