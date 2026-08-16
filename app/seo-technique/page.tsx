"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { PlaybookShell, Scene, SpotlightCard, Protocol } from "../playbook";

const chapters = [
  ["introduction", "Intro"], ["crawl", "Exploration"], ["robots", "robots.txt"],
  ["indexation", "Indexation"], ["sitemap", "Sitemap"], ["statuts", "Statuts"],
  ["rendu", "Rendu JS"], ["architecture", "Architecture"], ["parametres", "Paramètres"],
  ["migration", "Migration"], ["erreurs", "Erreurs"], ["checklist", "Checklist"],
] as const;

const checks = [
  "robots.txt accessible et sans blocage involontaire",
  "Sitemap XML à jour, sans URL non indexable",
  "Aucune page utile en noindex par erreur",
  "Contenu principal présent sans exécuter le JavaScript",
  "Chaînes de redirection réduites à un seul saut",
  "Pages supprimées en 404 ou 410, pas en soft 404",
  "Profondeur de trois clics maximum vers les pages clés",
  "Paramètres d'URL et facettes maîtrisés",
  "Pagination explorable",
  "Rapport d'indexation de Search Console sans anomalie",
  "Plan de redirection prêt avant toute refonte",
];

export default function SeoTechnique() {
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("mf-technique-audit-v1");
      // Hydratation client : la valeur n'existe pas au rendu serveur.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setChecked(JSON.parse(saved));
    } catch { /* stockage facultatif */ }
  }, []);

  const toggle = (index: number) => {
    setChecked((current) => {
      const next = current.includes(index) ? current.filter((item) => item !== index) : [...current, index];
      try { window.localStorage.setItem("mf-technique-audit-v1", JSON.stringify(next)); } catch { /* no-op */ }
      return next;
    });
  };
  const score = Math.round((checked.length / checks.length) * 100);

  return (
    <PlaybookShell
      current="technique"
      chapters={chapters}
      navLinks={[["#crawl", "Exploration"], ["#indexation", "Indexation"], ["#rendu", "Rendu"], ["#checklist", "Audit"]]}
      action={["#checklist", "Lancer l’audit"]}
      edition="PLAYBOOK 014 · SEO TECHNIQUE · 2026"
      baseline="Une page invisible pour le robot n'existe pas."
      hero={{
        kicker: "PLAYBOOK 014 / CRAWL & INDEXATION",
        title: <><span>SEO</span>{" "}<br/><em>TECHNIQUE</em>{" "}<br/>PLAYBOOK</>,
        brief: <>Rendre le site <strong>explorable, compréhensible et indexable</strong> : ce qui se passe entre la requête du robot et la présence dans l&apos;index.</>,
        telemetry: { label: "STATUS", state: "CRAWLABLE & INDEXED", detail: "200 · SITEMAP · RENDER" },
        wipe: "CRAWLED / INDEXED",
        mark: "BOT",
        coordinate: "48°51′N / 02°21′E · LIVE",
      }}
    >
      <Scene id="crawl" index="02" eyebrow="CRAWL / WHAT THE BOT SEES" tone="dark"
        title={<>Le robot ne lit pas{" "}<br/><em>ce que vous voyez.</em></>}
        description="Avant de classer, un moteur doit explorer, rendre, puis indexer. Chaque étape peut échouer indépendamment des autres, et une page bloquée à la première n'atteindra jamais la troisième.">
        <div className="manifesto-line"><span>EXPLORER</span><i>→</i><span>RENDRE</span><i>→</i><span>INDEXER</span><i>→</i><span>CLASSER</span></div>
        <div className="impact-matrix">
          {[['01','Exploration','Le robot demande l’URL. Un blocage, une erreur serveur ou une lenteur l’arrête ici.'],['02','Rendu','Le HTML est traité, le JavaScript éventuellement exécuté, plus tard et sans garantie.'],['03','Indexation','Le contenu obtenu est jugé digne d’être stocké. Ou non.'],['04','Classement','Seulement là interviennent le contenu, les liens et l’intention.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>PIPELINE</b></SpotlightCard>)}
        </div>
        <Protocol kind="note" title="Où ce playbook s’arrête">Le contenu et les Core Web Vitals relèvent du <Link href="/seo-on-page">playbook 011, on-page</Link> ; la résolution du domaine, HTTPS et le CDN relèvent du <Link href="/seo-dns">playbook 015, DNS</Link>. Ici, on traite ce qu’il y a entre les deux.</Protocol>
      </Scene>

      <Scene id="robots" index="03" eyebrow="ROBOTS.TXT" tone="light"
        title={<>Bloquer l&apos;exploration{" "}<br/><em>n&apos;empêche pas l&apos;indexation.</em></>}
        description="C’est la confusion la plus coûteuse du référencement technique : robots.txt contrôle l’accès du robot, pas la présence dans l’index. Une URL bloquée peut apparaître dans les résultats, sans description.">
        <div className="canonical-stage">
          <div className="incoming-routes"><small>OUTIL / EFFET</small><code><i/>robots.txt → accès</code><code><i/>noindex → index</code><code><i/>mot de passe → les deux</code></div>
          <div className="redirect-engine"><span>NE PAS CONFONDRE</span><strong>CRAWL ≠ INDEX</strong><div className="pulse-arrow">→</div><small>DEUX MÉCANISMES</small></div>
          <div className="canonical-target"><span>POUR DÉSINDEXER</span><strong>noindex, accessible</strong><b><i/> LE ROBOT DOIT LIRE LA BALISE</b></div>
        </div>
        <div className="protocol-row">
          <Protocol kind="do" title="La règle">Pour retirer une page de l’index, laissez-la explorable avec une balise noindex. Le robot doit pouvoir lire l’instruction pour l’appliquer.</Protocol>
          <Protocol kind="avoid" title="L’erreur classique">Bloquer une page dans robots.txt en espérant la désindexer. Le robot n’ira plus lire le noindex, et l’URL restera dans l’index.</Protocol>
        </div>
      </Scene>

      <Scene id="indexation" index="04" eyebrow="INDEX MANAGEMENT" tone="dark"
        title={<>Tout indexer{" "}<br/><em>n&apos;est pas un objectif.</em></>}
        description="Un site n’est pas jugé sur son nombre de pages indexées, mais sur leur qualité moyenne. Les pages vides, dupliquées ou techniques diluent l’ensemble.">
        <div className="record-system">
          {[['INDEXER','UTILE','Pages de contenu','Ce qui répond à une recherche'],['EXCLURE','TECHNIQUE','Panier, compte, filtres','Aucune valeur en recherche'],['ARBITRER','LIMITE','Tags, archives, pagination','Selon le volume réel de contenu']].map(([type,meta,quoi,desc])=><SpotlightCard key={type} className="record-module"><header><span>{type}</span><small>{meta}</small></header><h3>{desc}</h3><div><code>{quoi}</code><i>→</i><code>{meta}</code></div><footer>INDEX / ARBITRAGE</footer></SpotlightCard>)}
        </div>
        <div className="zone-terminal"><header><span>SEARCH CONSOLE / indexation</span><b>● À SURVEILLER</b></header><pre><b>INDEXÉE</b>              1 240 pages{"\n"}<b>EXPLORÉE, NON INDEXÉE</b>   380 pages{"\n"}<b>DÉTECTÉE, NON EXPLORÉE</b>  120 pages{"\n"}<b>DUPLIQUÉE</b>                64 pages</pre></div>
        <div className="chain-compare"><div><small>MAUVAIS SIGNAL</small><code>12 000 indexées, 400 utiles</code></div><i>×</i><div><small>BON SIGNAL</small><code>400 indexées, 400 utiles</code></div></div>
      </Scene>

      <Scene id="sitemap" index="05" eyebrow="XML SITEMAP" tone="gold"
        title={<>Le sitemap est{" "}<br/><em>une déclaration, pas un souhait.</em></>}
        description="Il indique les URL que vous considérez comme canoniques et indexables. Y placer des pages en noindex, redirigées ou en erreur envoie un signal contradictoire.">
        <div className="ssl-stage">
          <div className="ssl-seal"><div><span>COHÉRENCE</span><b>100%</b><small>URL INDEXABLES</small></div></div>
          <ol>{[['01','Uniquement des URL en statut 200'],['02','Uniquement des URL canoniques'],['03','Aucune page en noindex'],['04','Déclaré dans robots.txt']].map(([n,t])=><li key={n}><span>{n}</span><b>{t}</b><i>PASS</i></li>)}</ol>
        </div>
        <div className="protocol-row">
          <Protocol kind="do" title="Utilité réelle">Le sitemap aide surtout les gros sites et les pages peu liées en interne. Il ne remplace jamais un bon maillage.</Protocol>
          <Protocol kind="avoid" title="Fausse croyance">Ajouter une URL au sitemap ne la fait pas indexer. Cela signale son existence, rien de plus.</Protocol>
        </div>
      </Scene>

      <Scene id="statuts" index="06" eyebrow="HTTP STATUS & REDIRECTS" tone="light"
        title={<>Chaque URL répond{" "}<br/><em>quelque chose. Même absente.</em></>}
        description="Le code de statut est la première information transmise au robot. Un mauvais code fait garder des pages mortes ou disparaître des pages vivantes.">
        <div className="exposure-table"><header><span>SITUATION</span><span>CODE ATTENDU</span><span>RISQUE</span><span>ACTION</span></header>
          {[['Page déplacée définitivement','301','LOW','REDIRIGER'],['Page supprimée sans remplacement','410','LOW','ASSUMER'],['Page introuvable','404','MEDIUM','VÉRIFIER LES LIENS'],['Page vide renvoyant 200','SOFT 404','HIGH','CORRIGER']].map(([cas,code,risk,action])=><div key={cas} className={`risk-${risk.toLowerCase()}`}><code><i/>{cas}</code><span>{code}</span><b>{risk}</b><strong>{action}</strong></div>)}
        </div>
        <div className="protocol-row">
          <Protocol kind="do" title="Redirections">Un seul saut : l’ancienne URL pointe directement vers la destination finale. Les chaînes diluent le signal et gaspillent le budget d’exploration.</Protocol>
          <Protocol kind="avoid" title="Le piège du soft 404">Une page « produit introuvable » qui répond 200 reste indexée et occupe une place dans l’index. Elle doit répondre 404 ou 410.</Protocol>
        </div>
      </Scene>

      <Scene id="rendu" index="07" eyebrow="JAVASCRIPT RENDERING" tone="dark"
        title={<>Ce qui n&apos;est pas{" "}<br/><em>dans le HTML attend.</em></>}
        description="Google exécute le JavaScript, mais dans un second temps et sans garantie de délai. Le contenu qui n’apparaît qu’après exécution est indexé plus tard, parfois jamais.">
        <div className="trust-route">{[['01','HTML','IMMÉDIAT'],['02','FILE D’ATTENTE','DIFFÉRÉ'],['03','RENDU JS','INCERTAIN'],['✓','INDEX','COMPLET']].map(([n,t,m],i)=><div key={t} className={i===3?'verified':''}><span>{n}</span><b>{t}</b><small>{m}</small>{i < 3 ? <i>→</i> : null}</div>)}</div>
        <div className="trust-notes">
          <SpotlightCard><span>LE TEST</span><h3>Désactiver le JavaScript</h3><p>Chargez la page sans JavaScript. Le titre, le texte principal et les liens de navigation doivent être là. Sinon, ils dépendent du rendu différé.</p></SpotlightCard>
          <SpotlightCard><span>LA SOLUTION</span><h3>Servir le contenu en HTML</h3><p>Rendu côté serveur ou génération statique pour le contenu principal et les liens. Le JavaScript reste pour l’interaction, pas pour l’information.</p></SpotlightCard>
        </div>
        <Protocol kind="note" title="Cas fréquent">Une navigation construite en JavaScript sans balise de lien : le robot ne suit rien, et des pages entières deviennent inaccessibles par exploration.</Protocol>
      </Scene>

      <Scene id="architecture" index="08" eyebrow="SITE ARCHITECTURE" tone="light"
        title={<>Trois clics.{" "}<br/><em>Pas davantage.</em></>}
        description="La profondeur depuis l’accueil traduit l’importance que vous accordez à une page. Une page enfouie est explorée moins souvent et jugée moins importante.">
        <div className="network-radar">
          <div className="radar-core"><span>/</span><b>ACCUEIL</b><small>NIVEAU 0</small></div>
          <i className="radar-wave w1"/><i className="radar-wave w2"/><i className="radar-wave w3"/>
          {[['NIVEAU 1','catégories'],['NIVEAU 2','sous-catégories'],['NIVEAU 3','pages cibles'],['NIVEAU 4+','à remonter']].map(([n,t],i)=><div key={n} className={`edge-point p${i+1}`}><i/><span>{n}</span><b>{t}</b></div>)}
        </div>
        <div className="signal-grid">{[['01','Profondeur','Trois clics vers toute page qui compte.'],['02','Liens en dur','Des balises de lien, pas des gestionnaires de clic.'],['03','Fil d’Ariane','Il situe la page et crée des liens internes.'],['04','Cohérence','L’URL reflète le chemin de navigation.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></SpotlightCard>)}</div>
        <Protocol kind="note" title="Vérification">Partez de l’accueil et comptez les clics jusqu’à vos pages qui rapportent. Au-delà de trois, le maillage interne doit être revu.</Protocol>
      </Scene>

      <Scene id="parametres" index="09" eyebrow="PARAMETERS & FACETS" tone="dark"
        title={<>Un filtre peut créer{" "}<br/><em>dix mille pages.</em></>}
        description="Les filtres, tris et paramètres de suivi multiplient les URL pour un même contenu. Sur un catalogue, c’est la première cause d’explosion du nombre d’URL explorées.">
        <div className="zone-terminal"><header><span>URL / MÊME CONTENU</span><b>● À MAÎTRISER</b></header><pre><b>CANONIQUE</b>  /chaussures{"\n"}<b>TRI</b>        /chaussures?tri=prix{"\n"}<b>FILTRE</b>     /chaussures?couleur=noir&taille=42{"\n"}<b>SUIVI</b>      /chaussures?utm_source=news</pre></div>
        <div className="cdn-decisions">{[['GARDER INDEXABLE','Filtres à volume de recherche réel','Une catégorie par vraie demande','Contenu propre à la sélection'],['NEUTRALISER','Tris et affichages','Canonique vers la page mère','Aucune valeur ajoutée'],['EXCLURE','Paramètres de suivi','Jamais de contenu différent','Duplication pure']].map(([t,...items])=><SpotlightCard key={t}><span>{t}</span>{items.map(item=><p key={item}>↳ {item}</p>)}</SpotlightCard>)}</div>
        <Protocol kind="do" title="Pagination">Laissez les pages 2, 3, 4 explorables et auto-canoniques. Les rendre canoniques vers la page 1 empêche l’exploration des produits qu’elles seules listent.</Protocol>
      </Scene>

      <Scene id="migration" index="10" eyebrow="MIGRATION" tone="gold"
        title={<>Une refonte se prépare{" "}<br/><em>avant, pas après.</em></>}
        description="La majorité des pertes de trafic après refonte vient d’un plan de redirection fait dans l’urgence. Le travail se fait sur l’ancien site, pendant qu’il est encore en ligne.">
        <div className="verification-stage">
          <ol>{[['01','Exporter toutes les URL actuelles indexées'],['02','Associer chaque ancienne URL à une nouvelle'],['03','Rediriger en 301, un seul saut'],['04','Surveiller les erreurs les semaines suivantes']].map(([n,t])=><li key={n}><span>{n}</span><b>{t}</b></li>)}</ol>
          <div className="txt-terminal"><header><span>PLAN / REDIRECTIONS</span><b>AVANT MISE EN LIGNE</b></header><dl><div><dt>SOURCES</dt><dd>SITEMAP</dd></div><div><dt>+</dt><dd>SEARCH CONSOLE</dd></div><div><dt>+</dt><dd>LOGS</dd></div></dl><small>RÈGLE</small><code>Toute URL qui recevait du trafic doit avoir <b>une destination équivalente</b>.</code><footer><i/> PAS DE RENVOI EN MASSE VERS L’ACCUEIL</footer></div>
        </div>
        <Protocol kind="avoid" title="L’erreur qui coûte le plus cher">Rediriger toutes les anciennes URL vers l’accueil. Google traite ces redirections comme des soft 404 et le trafic ne revient pas.</Protocol>
      </Scene>

      <Scene id="erreurs" index="11" eyebrow="ANTI-PATTERN DATABASE" tone="danger"
        title={<>Les pannes silencieuses{" "}<br/><em>coûtent le plus cher.</em></>}
        description="Ces défauts ne provoquent aucune alerte visible. Le trafic baisse lentement, et la cause est souvent trouvée des mois plus tard.">
        <div className="anti-grid">{[['01','noindex oublié','Laissé après une mise en préproduction.'],['02','robots.txt bloquant','Une ligne copiée du serveur de test.'],['03','Canonique cassée','Toutes les pages pointent vers l’accueil.'],['04','Chaînes de redirection','Trois sauts avant la destination.'],['05','Contenu en JS seul','Invisible tant que le rendu n’a pas eu lieu.'],['06','Sitemap périmé','Des URL mortes déclarées comme actives.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>ABORT</b></SpotlightCard>)}</div>
        <div className="red-rule"><span>RULE / 014</span><p>Après chaque mise en production, vérifiez trois choses : <strong>le robots.txt, la balise robots des pages clés, et le code de statut de la page d’accueil</strong>. Ces trois contrôles prennent une minute et évitent la majorité des accidents.</p></div>
      </Scene>

      <Scene id="checklist" index="12" eyebrow="FINAL TECHNICAL AUDIT" tone="gold"
        title={<>Valider la mécanique.{" "}<br/><em>Avant de produire du contenu.</em></>}
        description="Onze contrôles techniques. La progression reste enregistrée sur cet appareil.">
        <div className="audit-console">
          <header><div><span>PRE-LAUNCH / TECHNIQUE</span><h3>{score===100?'SITE CRAWLABLE':'VALIDATION IN PROGRESS'}</h3></div><div className="audit-score"><b>{score}</b><span>%</span></div></header>
          <div className="audit-progress"><i style={{width:`${score}%`}}/></div>
          <div className="audit-list">{checks.map((item,index)=><label key={item} className={checked.includes(index)?'done':''}><input type="checkbox" checked={checked.includes(index)} onChange={()=>toggle(index)}/><i>{checked.includes(index)?'✓':''}</i><span>{item}</span><small>{checked.includes(index)?'PASS':'PENDING'}</small></label>)}</div>
          <footer><span>{checked.length} / {checks.length} CONTROLS PASSED</span><button onClick={()=>{setChecked([]);try{window.localStorage.removeItem('mf-technique-audit-v1')}catch{/* no-op */}}}>RESET AUDIT</button></footer>
        </div>
        <div className="outro"><span>MENTALITÉ FOCUS / PLAYBOOK 014</span><h3>Le meilleur contenu du monde{" "}<br/><em>ne classe pas s&apos;il n&apos;est pas lu.</em></h3><motion.span whileHover={{y:-5}} style={{display:"inline-block"}}><Link href="/seo-dns">PLAYBOOK DNS <i>↗</i></Link></motion.span></div>
      </Scene>
    </PlaybookShell>
  );
}
