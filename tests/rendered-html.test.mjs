import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
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

const PLAYBOOKS = ["/seo-on-page", "/seo-off-page", "/seo-local", "/seo-technique", "/seo-dns"];

/** Texte tel qu'un lecteur le voit : le split-text éclate les titres en un
 *  span par glyphe, donc chercher un mot dans le HTML brut ne donne rien. */
function texte(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ");
}

test("l'accueil présente la collection", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="fr">/);
  assert.match(texte(html), /PLAYBOOKS/);
  // Chaque édition doit être atteignable depuis l'accueil.
  for (const path of PLAYBOOKS) {
    assert.match(html, new RegExp(`href="${path}"`), `lien vers ${path} absent de l'accueil`);
  }
});

test("chaque playbook répond et porte son propre titre", async () => {
  const titres = [];
  for (const path of PLAYBOOKS) {
    const response = await render(path);
    assert.equal(response.status, 200, `${path} ne répond pas en 200`);
    const html = await response.text();
    const titre = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    assert.ok(titre.length > 10, `${path} sans titre exploitable`);
    titres.push(titre);
  }
  // Un titre dupliqué entre playbooks serait un défaut SEO.
  assert.equal(new Set(titres).size, titres.length, "deux playbooks partagent le même titre");
});

test("chaque playbook rend son hero collant et son audit", async () => {
  for (const path of PLAYBOOKS) {
    const html = await (await render(path)).text();
    assert.match(html, /class="hero-scene"/, `${path} sans hero`);
    assert.match(html, /class="hero-sticky"/, `${path} sans hero collant`);
    assert.match(html, /RESET AUDIT/, `${path} sans checklist`);
    const boxes = html.match(/type="checkbox"/g) ?? [];
    assert.equal(boxes.length, 11, `${path} n'a pas onze contrôles`);
  }
});

test("le playbook DNS rend ses douze chapitres", async () => {
  const html = await (await render("/seo-dns")).text();
  const chapters = [
    "introduction", "lien", "domaine", "records", "https", "subdomains",
    "cloudflare", "search-console", "dnssec", "cdn", "erreurs", "checklist",
  ];
  for (const id of chapters) {
    assert.match(html, new RegExp(`id="${id}"`), `chapitre ${id} absent`);
  }
});

test("chaque page déclare sa propre URL canonique", async () => {
  for (const path of ["/", ...PLAYBOOKS]) {
    const html = await (await render(path)).text();
    const canonical = html.match(/rel="canonical" href="([^"]*)"/)?.[1] ?? "";
    const attendu = path === "/" ? "" : path;
    assert.ok(
      canonical.endsWith(attendu),
      `canonique inattendue sur ${path} : ${canonical}`,
    );
  }
});
