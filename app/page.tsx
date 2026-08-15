"use client";

import { useEffect, useState } from "react";

const chapters = [
  ["introduction", "Introduction"],
  ["lien", "DNS & SEO"],
  ["domaine", "Domaine idéal"],
  ["records", "A, AAAA & CNAME"],
  ["https", "HTTPS & SSL"],
  ["subdomains", "Sous-domaines"],
  ["cloudflare", "DNS performant"],
  ["search-console", "Search Console"],
  ["dnssec", "DNSSEC"],
  ["cdn", "CDN & performances"],
  ["erreurs", "Erreurs à éviter"],
  ["checklist", "Checklist finale"],
] as const;

const checklist = [
  "Domaine principal défini",
  "Redirections configurées",
  "HTTPS forcé",
  "SSL valide",
  "DNS correctement configuré",
  "Aucun sous-domaine inutile exposé",
  "Google Search Console vérifiée",
  "DNSSEC activé si disponible",
  "CDN configuré si nécessaire",
  "Aucun CNAME inutile",
  "Aucun contenu dupliqué entre plusieurs sous-domaines",
];

const impacts = [
  ["01", "Stabilité", "Un DNS fiable limite les indisponibilités et les erreurs de résolution."],
  ["02", "Sécurité", "HTTPS, SSL et DNSSEC réduisent les risques d’interception ou d’usurpation."],
  ["03", "Performance", "Un DNS rapide et un CDN bien réglé raccourcissent le chemin vers la page."],
  ["04", "Cohérence", "Une URL canonique unique évite la dispersion des signaux et les doublons."],
];

function SectionHeading({ number, label, title, text }: { number: string; label: string; title: React.ReactNode; text: string }) {
  return (
    <header className="section-heading">
      <div className="section-index"><span>{number}</span><i /></div>
      <div>
        <small>{label}</small>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </header>
  );
}

function Callout({ kind, title, children }: { kind: "do" | "avoid" | "note"; title: string; children: React.ReactNode }) {
  return (
    <aside className={`callout ${kind}`}>
      <span className="callout-icon" aria-hidden="true">{kind === "do" ? "✓" : kind === "avoid" ? "×" : "i"}</span>
      <div><b>{title}</b><p>{children}</p></div>
    </aside>
  );
}

export default function Home() {
  const [checked, setChecked] = useState<number[]>([]);
  const [active, setActive] = useState("introduction");
  const [reading, setReading] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("dns-seo-playbook-checks");
      if (saved) setChecked(JSON.parse(saved));
    } catch { /* Le guide reste utilisable si le stockage est indisponible. */ }

    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setReading(height > 0 ? Math.min(100, Math.round((window.scrollY / height) * 100)) : 0);
      let current = chapters[0][0];
      for (const [id] of chapters) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= 180) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const score = Math.round((checked.length / checklist.length) * 100);

  const toggle = (index: number) => {
    setChecked((current) => {
      const next = current.includes(index) ? current.filter((item) => item !== index) : [...current, index];
      try { window.localStorage.setItem("dns-seo-playbook-checks", JSON.stringify(next)); } catch { /* no-op */ }
      return next;
    });
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="playbook-shell">
      <div className="reading-progress" aria-hidden="true"><i style={{ width: `${reading}%` }} /></div>
      <aside className={`sidebar ${menuOpen ? "open" : ""}`} aria-label="Sommaire du playbook">
        <a className="brand" href="#introduction" onClick={closeMenu} aria-label="Mentalité Focus — retour en haut">
          <span className="brand-mark">MF</span>
          <span><strong>Mentalité Focus</strong><small>PLAYBOOKS · 011</small></span>
        </a>
        <nav>
          {chapters.map(([id, label], index) => (
            <a key={id} className={active === id ? "active" : ""} href={`#${id}`} onClick={closeMenu}>
              <span>{String(index + 1).padStart(2, "0")}</span>{label}
            </a>
          ))}
        </nav>
        <div className="sidebar-foot"><span>GUIDE OPÉRATIONNEL</span><b>DNS / SEO</b></div>
      </aside>

      <div className="content">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Ouvrir le sommaire">{menuOpen ? "×" : "☰"}</button>
          <span>PLAYBOOK · INFRASTRUCTURE WEB</span>
          <span className="status"><i /> {reading}% lu</span>
        </header>

        <section className="hero" id="introduction">
          <div className="hero-copy">
            <span className="eyebrow"><i /> SEO TECHNIQUE · ÉDITION 2026</span>
            <h1>Optimisation<br />SEO avec <em>le DNS.</em></h1>
            <p>Le guide pour construire une base technique <strong>rapide, stable et sécurisée</strong> — même si vous débutez.</p>
            <div className="hero-actions">
              <a className="primary" href="#lien">Commencer le playbook <span>↓</span></a>
              <span className="reading-time">12 modules · 20 min</span>
            </div>
          </div>
          <div className="dns-console" aria-label="Aperçu de la configuration DNS idéale">
            <header><span><i /> DNS HEALTH</span><b>READY</b></header>
            <div className="orbit" aria-hidden="true"><i /><i /><i /><i /></div>
            <div className="console-center"><small>DOMAINE CANONIQUE</small><strong>https://site.fr</strong><span>1 seule destination</span></div>
            <div className="console-stats">
              <div><span>HTTPS</span><b>FORCÉ</b></div><div><span>DNSSEC</span><b>ACTIF</b></div><div><span>REDIRECT</span><b>301</b></div>
            </div>
          </div>
        </section>

        <section className="truth-strip" id="lien">
          <div className="truth-copy"><span>02 · LE POINT CLÉ</span><h2>Le DNS ne fait pas monter votre site directement sur Google.</h2><p>Il agit sur l’infrastructure. Une mauvaise configuration peut créer des lenteurs, des erreurs, des failles ou du contenu dupliqué — et ces problèmes peuvent freiner le SEO.</p></div>
          <div className="impact-grid">
            {impacts.map(([n, title, text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
          <Callout kind="note" title="À retenir">Le DNS est un levier indirect. Il protège les conditions techniques nécessaires à une bonne exploration, une bonne expérience utilisateur et une indexation cohérente.</Callout>
        </section>

        <section className="light-section" id="domaine">
          <SectionHeading number="03" label="CONFIGURATION IDÉALE DU DOMAINE" title={<>Une seule porte d’entrée.<br /><em>Aucune ambiguïté.</em></>} text="Choisissez une version principale, puis faites converger toutes les variantes vers elle." />
          <div className="choice-grid">
            <article className="choice-card chosen"><header><span>OPTION A</span><b>RECOMMANDÉE ICI</b></header><strong>site.fr</strong><p>Courte, directe et facile à communiquer.</p><footer>URL canonique · https://site.fr</footer></article>
            <article className="choice-card"><header><span>OPTION B</span><b>TOUT AUSSI VALIDE</b></header><strong>www.site.fr</strong><p>Pratique pour certaines architectures et règles de cookies.</p><footer>Le choix compte moins que la cohérence.</footer></article>
          </div>
          <div className="redirect-board" aria-label="Schéma des redirections vers la version canonique">
            <header><span>SCHÉMA CANONIQUE</span><b>TOUTES LES ROUTES → 1 URL</b></header>
            <div className="redirect-flow">
              <div className="source-stack"><code>http://site.fr</code><code>http://www.site.fr</code><code>https://www.site.fr</code></div>
              <div className="redirect-arrow"><span>REDIRECTION PERMANENTE</span><b>301 / 308</b><i>→</i></div>
              <div className="canonical-node"><small>VERSION CANONIQUE</small><strong>https://site.fr</strong><span>✓ indexable</span></div>
            </div>
          </div>
          <div className="callout-grid"><Callout kind="do" title="À faire">Définir la redirection au niveau du serveur, du CDN ou de la plateforme. Le DNS seul ne renvoie pas une redirection HTTP.</Callout><Callout kind="avoid" title="À éviter">Laisser plusieurs versions répondre en 200. Google pourrait explorer et interpréter plusieurs copies du même site.</Callout></div>
        </section>

        <section className="dark-section" id="records">
          <SectionHeading number="04" label="A, AAAA & CNAME" title={<>Les bons enregistrements.<br /><em>Au bon endroit.</em></>} text="Chaque type d’enregistrement a un rôle précis. Gardez la zone DNS courte, lisible et documentée." />
          <div className="record-grid">
            <article><span className="record-letter">A</span><div><small>IPv4</small><h3>Nom → adresse IPv4</h3><p>Relie le domaine à une adresse serveur IPv4.</p><code>@ → 192.0.2.10</code></div></article>
            <article><span className="record-letter">AAAA</span><div><small>IPv6</small><h3>Nom → adresse IPv6</h3><p>À publier uniquement si l’origine répond réellement en IPv6.</p><code>@ → 2001:db8::10</code></div></article>
            <article><span className="record-letter">C</span><div><small>CNAME</small><h3>Alias → autre nom</h3><p>Idéal pour un sous-domaine comme www.</p><code>www → site.fr</code></div></article>
          </div>
          <div className="config-panel">
            <header><span>EXEMPLE · ZONE DNS</span><b>dns.config</b></header>
            <pre><span>TYPE</span>   <span>NOM</span>       <span>VALEUR</span>{"\n"}<b>A</b>      @         192.0.2.10{"\n"}<b>AAAA</b>   @         2001:db8::10{"\n"}<b>CNAME</b>  www       site.fr.{"\n"}<b>TXT</b>    @         google-site-verification=…</pre>
          </div>
          <div className="chain-card"><div><span>CHAÎNE INUTILE</span><code>www → app → edge → origin</code></div><i>×</i><div><span>CHEMIN PROPRE</span><code>www → site.fr</code></div></div>
          <Callout kind="avoid" title="Pourquoi éviter les chaînes de CNAME ?">Elles ajoutent des résolutions, compliquent le diagnostic et multiplient les points de panne. Un alias direct est plus simple et plus robuste.</Callout>
        </section>

        <section className="light-section" id="https">
          <SectionHeading number="05" label="HTTPS & SSL" title={<>Sécuriser chaque requête.<br /><em>Sans exception.</em></>} text="HTTPS protège les visiteurs et évite les variantes non sécurisées du site." />
          <div className="security-layout">
            <div className="security-score"><div className="score-ring"><span>SSL</span><b>OK</b></div><h3>Certificat valide</h3><p>Valide, non expiré, reconnu par les navigateurs et couvrant chaque nom utilisé.</p></div>
            <ol className="security-steps">
              <li><span>01</span><div><b>Couvrir les bons noms</b><p><code>site.fr</code> et <code>www.site.fr</code> si les deux existent.</p></div></li>
              <li><span>02</span><div><b>Forcer HTTPS</b><p>Rediriger chaque URL HTTP en 301 ou 308.</p></div></li>
              <li><span>03</span><div><b>Contrôler le renouvellement</b><p>Activer l’automatisation et surveiller l’expiration.</p></div></li>
              <li><span>04</span><div><b>Éliminer le contenu mixte</b><p>Images, scripts et feuilles de style doivent aussi utiliser HTTPS.</p></div></li>
            </ol>
          </div>
          <div className="callout-grid"><Callout kind="do" title="Test rapide">Ouvrez la version HTTP : elle doit basculer immédiatement vers la même page en HTTPS.</Callout><Callout kind="avoid" title="Erreur classique">Rediriger uniquement la page d’accueil. Chaque ancienne URL doit conserver son chemin lors du passage en HTTPS.</Callout></div>
        </section>

        <section className="cream-section" id="subdomains">
          <SectionHeading number="06" label="SOUS-DOMAINES" title={<>Réduire la surface.<br /><em>Garder le contrôle.</em></>} text="Chaque sous-domaine public est une porte potentielle pour les robots, les visiteurs… et parfois les attaquants." />
          <div className="subdomain-audit">
            <header><span>INVENTAIRE À AUDITER</span><b>ACTION</b></header>
            {[['dev.site.fr','ENVIRONNEMENT DEV','Supprimer ou restreindre'],['test.site.fr','RECETTE','Protéger par authentification'],['staging.site.fr','PRÉPRODUCTION','Bloquer l’indexation + accès'],['blog.site.fr','CONTENU ACTIF','Conserver si stratégique']].map(([domain,usage,action],i)=><article key={domain} className={i===3?'safe':''}><span className="audit-dot"/><code>{domain}</code><small>{usage}</small><b>{action}</b></article>)}
          </div>
          <div className="two-column-copy"><Callout kind="do" title="Sous-domaine actif">Vérifiez son utilité, son HTTPS, son accès, son sitemap et ses balises canoniques. Liez-le clairement au domaine principal si le contenu doit être découvert.</Callout><Callout kind="avoid" title="Contenu dupliqué">Ne publiez pas la même page sur <code>site.fr</code> et <code>blog.site.fr</code>. Fusionnez, redirigez ou canonicalisez selon le cas.</Callout></div>
        </section>

        <section className="dark-section cloudflare-section" id="cloudflare">
          <SectionHeading number="07" label="CLOUDFLARE / DNS PERFORMANT" title={<>Un DNS rapide.<br /><em>Et disponible.</em></>} text="Un fournisseur DNS anycast et fiable réduit les risques d’indisponibilité et accélère la première étape de connexion." />
          <div className="provider-card">
            <div className="provider-head"><span className="cf-mark">CF</span><div><small>EXEMPLE DE FOURNISSEUR</small><h3>Cloudflare</h3></div><b>DNS · CDN · SÉCURITÉ</b></div>
            <div className="provider-signals"><div><span>01</span><b>Réseau mondial</b><p>Réponses DNS proches des visiteurs.</p></div><div><span>02</span><b>Haute disponibilité</b><p>Moins de dépendance à un serveur unique.</p></div><div><span>03</span><b>Proxy & cache</b><p>Protection et accélération si activées.</p></div><div><span>04</span><b>Observabilité</b><p>Règles et événements plus faciles à suivre.</p></div></div>
          </div>
          <Callout kind="note" title="Le bon critère">Choisissez un DNS avec une bonne disponibilité, des temps de réponse réguliers, un support DNSSEC et une interface d’audit claire. Cloudflare est un exemple, pas une obligation.</Callout>
        </section>

        <section className="light-section" id="search-console">
          <SectionHeading number="08" label="GOOGLE SEARCH CONSOLE" title={<>Prouver que le domaine<br /><em>vous appartient.</em></>} text="La propriété de type Domaine couvre tous les protocoles et tous les sous-domaines en une seule vérification DNS." />
          <div className="gsc-layout">
            <ol className="numbered-list"><li><span>01</span><div><b>Ajouter une propriété Domaine</b><p>Saisissez <code>site.fr</code> sans protocole ni chemin.</p></div></li><li><span>02</span><div><b>Copier la valeur TXT</b><p>Google fournit une chaîne de vérification unique.</p></div></li><li><span>03</span><div><b>Publier dans la zone DNS</b><p>Ajoutez le TXT à la racine du domaine.</p></div></li><li><span>04</span><div><b>Lancer la vérification</b><p>Conservez ensuite l’enregistrement.</p></div></li></ol>
            <div className="txt-card"><header><span>ENREGISTREMENT TXT</span><b>GSC</b></header><div><small>TYPE</small><strong>TXT</strong></div><div><small>NOM</small><strong>@</strong></div><div className="wide"><small>VALEUR</small><code>google-site-verification=AbC123…</code></div><footer>TTL · AUTO / 3600</footer></div>
          </div>
          <Callout kind="do" title="Bon réflexe">Utilisez une propriété Domaine pour avoir une vue unifiée de <code>http</code>, <code>https</code>, <code>www</code> et des sous-domaines.</Callout>
        </section>

        <section className="cream-section" id="dnssec">
          <SectionHeading number="09" label="DNSSEC" title={<>Signer les réponses.<br /><em>Préserver la confiance.</em></>} text="DNSSEC aide le résolveur à vérifier que la réponse DNS reçue est authentique et n’a pas été modifiée." />
          <div className="trust-chain"><div><span>01</span><b>Registre</b><small>.fr</small></div><i>→</i><div><span>02</span><b>Registrar</b><small>Enregistrement DS</small></div><i>→</i><div><span>03</span><b>DNS autoritatif</b><small>Zone signée</small></div><i>→</i><div className="verified"><span>✓</span><b>Réponse validée</b><small>Chaîne de confiance</small></div></div>
          <div className="dnssec-cards"><article><span>ACTIVER</span><h3>Chez le fournisseur DNS</h3><p>Activez la signature de zone, puis publiez le DS demandé chez le registrar si ce n’est pas automatisé.</p></article><article><span>VÉRIFIER</span><h3>Après chaque migration</h3><p>Un DS ancien avec de nouvelles clés peut rendre le domaine inaccessible. Coordonnez la bascule.</p></article></div>
          <Callout kind="note" title="DNSSEC ≠ HTTPS">DNSSEC protège l’intégrité de la résolution DNS. HTTPS chiffre la connexion au site. Les deux mécanismes sont complémentaires.</Callout>
        </section>

        <section className="dark-section" id="cdn">
          <SectionHeading number="10" label="CDN & PERFORMANCES" title={<>Rapprocher le contenu.<br /><em>Réduire la distance.</em></>} text="Un CDN peut servir les fichiers depuis un point proche du visiteur, absorber les pics et protéger l’origine." />
          <div className="cdn-map">
            <div className="origin"><small>ORIGINE</small><strong>Paris</strong><span>Serveur principal</span></div>
            <div className="map-lines" aria-hidden="true"><i/><i/><i/></div>
            <div className="edge-nodes"><div><span>EDGE</span><b>Montréal</b></div><div><span>EDGE</span><b>Dakar</b></div><div><span>EDGE</span><b>Singapour</b></div></div>
          </div>
          <div className="decision-grid"><article><span>PERTINENT SI</span><ul><li>Audience répartie géographiquement</li><li>Beaucoup d’images ou de fichiers statiques</li><li>Pics de trafic ou besoin de protection</li></ul></article><article><span>À RÉGLER AVEC SOIN</span><ul><li>Règles de cache HTML</li><li>Purge après publication</li><li>Cookies et pages personnalisées</li></ul></article><article><span>À MESURER</span><ul><li>TTFB et latence DNS</li><li>Taux de cache HIT</li><li>Disponibilité de l’origine</li></ul></article></div>
        </section>

        <section className="light-section" id="erreurs">
          <SectionHeading number="11" label="ERREURS À ÉVITER" title={<>Les raccourcis créent<br /><em>de la dette technique.</em></>} text="Une zone DNS simple est plus facile à sécuriser, à migrer et à diagnostiquer." />
          <div className="error-grid">
            {[['01','Multiplier les sous-domaines','Créer des dizaines de sous-domaines sans besoin produit ou éditorial réel.'],['02','Fabriquer des CNAME “SEO”','Les alias ne créent ni autorité ni avantage de classement.'],['03','Laisser les environnements ouverts','Un staging indexable peut exposer des copies et des données sensibles.'],['04','Mélanger les versions','HTTP, HTTPS, www et non-www ne doivent pas vivre en parallèle.'],['05','Oublier les anciennes cibles','Des enregistrements orphelins peuvent être détournés ou casser.'],['06','Changer sans plan de retour','Une migration DNS doit prévoir TTL, ordre des étapes et contrôle après bascule.']].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>À ÉVITER</b></article>)}
          </div>
          <div className="warning-banner"><span>RÈGLE D’OR</span><p>Ne créez jamais énormément de sous-domaines ou de CNAME dans le seul but de manipuler le SEO. <strong>Google évalue le contenu et l’expérience, pas la quantité d’entrées DNS.</strong></p></div>
        </section>

        <section className="checklist-section" id="checklist">
          <SectionHeading number="12" label="CHECKLIST FINALE" title={<>Votre DNS est-il<br /><em>prêt pour le SEO ?</em></>} text="Cochez chaque contrôle. Votre progression est conservée sur cet appareil." />
          <div className="checklist-dashboard">
            <header><div><span>AUDIT DE PRÉ-LANCEMENT</span><h3>{checked.length === checklist.length ? "Configuration prête." : "Validez les fondamentaux."}</h3></div><div className="score"><b>{score}</b><span>%</span></div></header>
            <div className="check-track"><i style={{ width: `${score}%` }} /></div>
            <div className="checks">
              {checklist.map((item,index)=><label key={item} className={checked.includes(index)?'done':''}><input type="checkbox" checked={checked.includes(index)} onChange={()=>toggle(index)} /><i aria-hidden="true">{checked.includes(index)?'✓':''}</i><span>{item}</span><small>{checked.includes(index)?'VALIDÉ':'À VÉRIFIER'}</small></label>)}
            </div>
            <footer><p><b>{checked.length}</b> contrôles validés sur {checklist.length}</p><button onClick={()=>{setChecked([]);try{window.localStorage.removeItem('dns-seo-playbook-checks')}catch{}}}>Réinitialiser</button></footer>
          </div>
          <div className="final-card"><span>MENTALITÉ FOCUS · PLAYBOOK 011</span><h3>Un DNS propre ne promet pas la première place.<br />Il évite de partir avec un handicap.</h3><a href="#introduction">Revenir au début <i>↑</i></a></div>
        </section>
      </div>
    </main>
  );
}
