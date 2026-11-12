import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/Button";

describe("Button focus ring", () => {
  it.each(["primary", "outline", "on-dark"] as const)("%s shows the outline only on focus-visible", (variant) => {
    const html = renderToStaticMarkup(<Button variant={variant} href="/x">Go</Button>);
    const cls = /class="([^"]*)"/.exec(html)![1].split(/\s+/);
    expect(cls).toContain("focus-visible:outline-2");
    const bare = cls.filter((c) => /(^|:)outline/.test(c) && !c.startsWith("focus-visible:"));
    expect(bare).toEqual([]);
  });
});
