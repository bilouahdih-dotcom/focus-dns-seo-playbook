import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("sert le playbook en HTML", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="fr">/);
  assert.match(html, /MENTALITÉ FOCUS/);
  assert.match(html, /PLAYBOOK/);
});

test("rend les douze chapitres côté serveur", async () => {
  const html = await (await render()).text();
  const chapters = [
    "introduction", "lien", "domaine", "records", "https", "subdomains",
    "cloudflare", "search-console", "dnssec", "cdn", "erreurs", "checklist",
  ];
  for (const id of chapters) {
    assert.match(html, new RegExp(`id="${id}"`), `chapitre ${id} absent du HTML`);
  }
});

test("rend le hero collant et son contenu", async () => {
  const html = await (await render()).text();
  // Le hero repose sur .hero-scene > .hero-sticky : sans ce couple, l'axe
  // de scroll du hero ne fonctionne plus.
  assert.match(html, /class="hero-scene"/);
  assert.match(html, /class="hero-sticky"/);
  assert.match(html, /class="dns-prism"/);
});

test("rend la checklist d'audit complète", async () => {
  const html = await (await render()).text();
  assert.match(html, /RESET AUDIT/);
  const boxes = html.match(/type="checkbox"/g) ?? [];
  assert.equal(boxes.length, 11);
});
