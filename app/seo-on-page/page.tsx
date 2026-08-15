"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { PlaybookShell, Scene, SpotlightCard, Protocol } from "../playbook";

const chapters = [
  ["introduction", "Intro"], ["intention", "Intention"], ["title", "Title"],
  ["structure", "Structure"], ["contenu", "Contenu"], ["url", "URL"],
  ["maillage", "Maillage"], ["images", "Images"], ["donnees", "Données"],
  ["vitesse", "Vitesse"], ["erreurs", "Erreurs"], ["checklist", "Checklist"],
] as const;

const checks = [
  "Une intention de recherche par page",
  "Title unique, sous 60 caractères",
  "Meta description écrite, sous 155 caractères",
  "Un seul H1, hiérarchie Hn continue",
  "Contenu répondant à la question posée",
  "URL courte, lisible, sans paramètre inutile",
  "Liens internes contextuels vers les pages clés",
  "Images en attribut alt et format moderne",
  "Balise canonique sur chaque page",
  "Données structurées valides",
  "Core Web Vitals dans le vert",
];

export default function SeoOnPage() {
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("mf-onpage-audit-v1");
      // Hydratation client : la valeur n'existe pas au rendu serveur.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setChecked(JSON.parse(saved));
    } catch { /* stockage facultatif */ }
  }, []);

  const toggle = (index: number) => {
    setChecked((current) => {
      const next = current.includes(index) ? current.filter((item) => item !== index) : [...current, index];
      try { window.localStorage.setItem("mf-onpage-audit-v1", JSON.stringify(next)); } catch { /* no-op */ }
      return next;
    });
  };
  const score = Math.round((checked.length / checks.length) * 100);

  return (
    <PlaybookShell
      current="on-page"
      chapters={chapters}
      navLinks={[["#intention", "Intention"], ["#contenu", "Contenu"], ["#maillage", "Maillage"], ["#checklist", "Audit"]]}
      action={["#checklist", "Lancer l’audit"]}
      edition="PLAYBOOK 012 · SEO ON-PAGE · 2026"
      hero={{
        kicker: "PLAYBOOK 012 / ON-PAGE OPTIMIZATION",
        title: <><span>SEO</span>{" "}<br/><em>ON-PAGE</em>{" "}<br/>PLAYBOOK</>,
        brief: <>Rendre chaque page <strong>compréhensible, unique et utile</strong> : ce que le moteur lit, ce qu&apos;il comprend, ce qu&apos;il décide d&apos;afficher.</>,
        telemetry: { label: "STATUS", state: "PAGE READY TO RANK", detail: "TITLE · Hn · SCHEMA" },
        wipe: "ONE PAGE / ONE INTENT",
        mark: "SEO",
        coordinate: "48°51′N / 02°21′E · LIVE",
      }}
    >
      <Scene id="intention" index="02" eyebrow="SEARCH INTENT / THE STARTING POINT" tone="dark"
        title={<>Une page ne se classe pas.{" "}<br/><em>Une réponse se classe.</em></>}
        description="Avant la technique, une page doit correspondre à ce que la personne cherchait vraiment. Le moteur compare votre page à ce que les internautes ont jugé satisfaisant.">
        <div className="manifesto-line"><span>INFORMER</span><i>×</i><span>COMPARER</span><i>×</i><span>ACHETER</span><i>×</i><span>ACCÉDER</span></div>
        <div className="impact-matrix">
          {[['01','Informationnelle','La personne veut comprendre. Réponse claire, structurée, sans détour commercial.'],['02','Commerciale','Elle compare. Critères, différences, preuves et cas concrets.'],['03','Transactionnelle','Elle est prête. Offre, prix, réassurance et action immédiate.'],['04','Navigationnelle','Elle cherche une marque précise. Ne pas la détourner.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>SEARCH INTENT</b></SpotlightCard>)}
        </div>
        <Protocol kind="note" title="Le test">Tapez votre mot-clé. Les dix premiers résultats ont un format dominant : guide, comparatif, fiche produit. Si votre page ne prend pas ce format, elle joue contre le consensus.</Protocol>
      </Scene>

      <Scene id="title" index="03" eyebrow="TITLE & DESCRIPTION" tone="light"
        title={<>Deux lignes décident{" "}<br/><em>si l&apos;on vous ouvre.</em></>}
        description="Le title est le premier signal de pertinence et la première décision de clic. La description ne classe pas, mais elle vend le résultat.">
        <div className="canonical-stage">
          <div className="incoming-routes"><small>INPUT / VARIANTS</small><code><i/>Accueil - Site</code><code><i/>Bienvenue sur notre site</code><code><i/>Services | Entreprise | Ville</code></div>
          <div className="redirect-engine"><span>REWRITE</span><strong>60 / 155</strong><div className="pulse-arrow">→</div><small>CARACTÈRES MAX</small></div>
          <div className="canonical-target"><span>TITLE UTILE</span><strong>Configurer un DNS sans nuire au SEO</strong><b><i/> UNIQUE · EXPLICITE</b></div>
        </div>
        <div className="protocol-row">
          <Protocol kind="do" title="À faire">Le mot-clé principal au début, un bénéfice concret ensuite, la marque à la fin seulement si la place le permet.</Protocol>
          <Protocol kind="avoid" title="À éviter">Répéter le même title sur plusieurs pages, empiler les mots-clés, ou laisser Google réécrire faute d&apos;un title clair.</Protocol>
        </div>
      </Scene>

      <Scene id="structure" index="04" eyebrow="HEADING STRUCTURE" tone="dark"
        title={<>Un H1. Des H2.{" "}<br/><em>Aucun trou.</em></>}
        description="La hiérarchie des titres est le plan du document. Elle guide le lecteur pressé, et donne au moteur la structure logique du contenu.">
        <div className="record-system">
          {[['H1','UNIQUE','1 par page','Le sujet de la page'],['H2','SECTION','5 à 12','Les grandes parties'],['H3','DÉTAIL','libre','Les points d’une partie']].map(([type,meta,count,desc])=><SpotlightCard key={type} className="record-module"><header><span>{type}</span><small>{meta}</small></header><h3>{desc}</h3><div><code>{count}</code><i>→</i><code>{meta}</code></div><footer>PLAN / DOCUMENT</footer></SpotlightCard>)}
        </div>
        <div className="zone-terminal"><header><span>OUTLINE / page</span><b>● VALID</b></header><pre><b>H1</b>    Optimisation SEO on-page{"\n"}<b>H2</b>    Comprendre l’intention{"\n"}<b>H3</b>      Les quatre types{"\n"}<b>H2</b>    Rédiger le title{"\n"}<b>H2</b>    Structurer le contenu</pre></div>
        <div className="chain-compare"><div><small>PLAN / CASSÉ</small><code>H1 → H4 → H2 → H4</code></div><i>×</i><div><small>PLAN / LISIBLE</small><code>H1 → H2 → H3 → H2</code></div></div>
      </Scene>

      <Scene id="contenu" index="05" eyebrow="CONTENT & SEMANTICS" tone="gold"
        title={<>Écrire pour répondre.{" "}<br/><em>Pas pour remplir.</em></>}
        description="Le moteur ne compte plus les occurrences : il reconnaît des entités, des questions et des réponses. Couvrir le sujet vaut mieux que répéter le mot-clé.">
        <div className="ssl-stage">
          <div className="ssl-seal"><div><span>COUVERTURE</span><b>100%</b><small>DU SUJET TRAITÉ</small></div></div>
          <ol>{[['01','Répondre dès le premier paragraphe'],['02','Traiter les questions connexes'],['03','Nommer les entités du domaine'],['04','Apporter une preuve ou un exemple']].map(([n,t])=><li key={n}><span>{n}</span><b>{t}</b><i>PASS</i></li>)}</ol>
        </div>
        <div className="protocol-row">
          <Protocol kind="do" title="Bon réflexe">Lisez les questions posées dans les résultats et les forums du secteur, puis répondez-y explicitement dans la page.</Protocol>
          <Protocol kind="avoid" title="Piège">Le contenu écrit pour atteindre un nombre de mots. La longueur ne classe pas ; la réponse complète, oui.</Protocol>
        </div>
      </Scene>

      <Scene id="url" index="06" eyebrow="URL DESIGN" tone="light"
        title={<>Une URL se lit{" "}<br/><em>avant d&apos;être cliquée.</em></>}
        description="Courte, stable et descriptive : l’URL est affichée dans les résultats, partagée telle quelle, et doit rester valable des années.">
        <div className="exposure-table"><header><span>URL</span><span>LISIBILITÉ</span><span>RISQUE</span><span>ACTION</span></header>
          {[['/p?id=48219','FAIBLE','HIGH','RÉÉCRIRE'],['/blog/2019/05/article-final-v2','MOYENNE','MEDIUM','SIMPLIFIER'],['/seo/dns','FORTE','LOW','CONSERVER'],['/services/agence-seo-paris','FORTE','LOW','CONSERVER']].map(([url,lis,risk,action])=><div key={url} className={`risk-${risk.toLowerCase()}`}><code><i/>{url}</code><span>{lis}</span><b>{risk}</b><strong>{action}</strong></div>)}
        </div>
        <div className="protocol-row">
          <Protocol kind="do" title="Structure">Des mots séparés par des tirets, en minuscules, sans accent, reflétant le chemin logique du site.</Protocol>
          <Protocol kind="avoid" title="Changement d’URL">Ne renommez pas une URL qui fonctionne. Si vous devez le faire, redirigez en 301 et mettez à jour les liens internes.</Protocol>
        </div>
      </Scene>

      <Scene id="maillage" index="07" eyebrow="INTERNAL LINKING" tone="dark"
        title={<>Vos pages se{" "}<br/><em>recommandent entre elles.</em></>}
        description="Le maillage interne distribue la popularité et explique au moteur quelles pages comptent. C’est le levier on-page le plus sous-utilisé.">
        <div className="network-radar">
          <div className="radar-core"><span>P</span><b>PAGE PILIER</b><small>SUJET PRINCIPAL</small></div>
          <i className="radar-wave w1"/><i className="radar-wave w2"/><i className="radar-wave w3"/>
          {[['GUIDE','3 liens'],['CAS','2 liens'],['FAQ','4 liens'],['OFFRE','1 lien']].map(([n,t],i)=><div key={n} className={`edge-point p${i+1}`}><i/><span>{n}</span><b>{t}</b></div>)}
        </div>
        <div className="signal-grid">{[['01','Ancre descriptive','Le texte du lien annonce la page d’arrivée.'],['02','Profondeur','Trois clics maximum depuis l’accueil.'],['03','Sens','Du contenu vers la page qui convertit.'],['04','Cohérence','Les pages d’un même thème se citent.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></SpotlightCard>)}</div>
        <Protocol kind="note" title="Règle simple">Une page importante sans lien interne entrant est une page que vous jugez vous-même secondaire. Le moteur en tirera la même conclusion.</Protocol>
      </Scene>

      <Scene id="images" index="08" eyebrow="MEDIA OPTIMIZATION" tone="light"
        title={<>Une image décrite{" "}<br/><em>est une image indexée.</em></>}
        description="L’attribut alt sert d’abord aux personnes qui n’voient pas l’image, puis au moteur. Le poids, lui, décide de la vitesse perçue.">
        <div className="verification-stage">
          <ol>{[['01','Décrire l’image, pas le mot-clé'],['02','Servir en AVIF ou WebP'],['03','Dimensionner à la taille réelle d’affichage'],['04','Différer le chargement hors écran']].map(([n,t])=><li key={n}><span>{n}</span><b>{t}</b></li>)}</ol>
          <div className="txt-terminal"><header><span>MARKUP / IMG</span><b>ALT</b></header><dl><div><dt>FORMAT</dt><dd>AVIF</dd></div><div><dt>POIDS</dt><dd>84 Ko</dd></div><div><dt>LOADING</dt><dd>LAZY</dd></div></dl><small>ATTRIBUT ALT</small><code>alt=&quot;<b>Zone DNS avec un enregistrement A et un CNAME</b>&quot;</code><footer><i/> DESCRIPTIF ET UTILE</footer></div>
        </div>
        <Protocol kind="do" title="Bon alt">Écrivez ce que vous diriez à quelqu’un au téléphone pour décrire l’image. Si l’image est purement décorative, laissez l’attribut vide.</Protocol>
      </Scene>

      <Scene id="donnees" index="09" eyebrow="STRUCTURED DATA" tone="dark"
        title={<>Dire au moteur{" "}<br/><em>ce qu&apos;il regarde.</em></>}
        description="Les données structurées ne classent pas directement, mais elles rendent la page éligible aux résultats enrichis et lèvent toute ambiguïté sur sa nature.">
        <div className="trust-route">{[['01','PAGE','CONTENU'],['02','SCHEMA','JSON-LD'],['03','MOTEUR','COMPRIS'],['✓','SERP','ENRICHIE']].map(([n,t,m],i)=><div key={t} className={i===3?'verified':''}><span>{n}</span><b>{t}</b><small>{m}</small>{i < 3 ? <i>→</i> : null}</div>)}</div>
        <div className="trust-notes">
          <SpotlightCard><span>À DÉCLARER</span><h3>Le type réel de la page</h3><p>Article, Product, FAQPage, HowTo, LocalBusiness, Organization. Un type par page, celui qui correspond vraiment.</p></SpotlightCard>
          <SpotlightCard><span>À VÉRIFIER</span><h3>La cohérence avec le visible</h3><p>Un balisage qui annonce une note ou un prix absent de la page est une cause directe de sanction manuelle.</p></SpotlightCard>
        </div>
        <Protocol kind="note" title="Format">Le JSON-LD dans le head est le format recommandé par Google : il se lit sans exécuter la page et se maintient sans toucher au HTML du contenu.</Protocol>
      </Scene>

      <Scene id="vitesse" index="10" eyebrow="CORE WEB VITALS" tone="light"
        title={<>La vitesse n&apos;est pas{" "}<br/><em>un bonus technique.</em></>}
        description="Les Core Web Vitals mesurent l’expérience réelle : le temps d’affichage du contenu principal, la stabilité visuelle et la réactivité aux interactions.">
        <div className="cdn-decisions">{[['LCP · 2,5 s','Le plus grand élément visible','Image du hero optimisée','Police préchargée'],['CLS · 0,1','Aucun saut de mise en page','Dimensions réservées','Pas d’insertion tardive'],['INP · 200 ms','Réponse aux interactions','Moins de JavaScript','Travail découpé']].map(([t,...items])=><SpotlightCard key={t}><span>{t}</span>{items.map(item=><p key={item}>↳ {item}</p>)}</SpotlightCard>)}</div>
        <Protocol kind="do" title="Mesurer d’abord">Prenez les données terrain avant d’optimiser : un score de laboratoire flatteur cache souvent une expérience mobile lente.</Protocol>
      </Scene>

      <Scene id="erreurs" index="11" eyebrow="ANTI-PATTERN DATABASE" tone="danger"
        title={<>Ce qui annule{" "}<br/><em>tout le reste.</em></>}
        description="La plupart des pages qui ne décollent pas ne souffrent pas d’un manque d’optimisation, mais d’un de ces défauts structurels.">
        <div className="anti-grid">{[['01','Deux pages, un sujet','Elles se concurrencent et se divisent.'],['02','Title dupliqué','Le moteur ne sait plus laquelle afficher.'],['03','Contenu sous l’onglet','Masqué au chargement, sous-évalué.'],['04','Page orpheline','Aucun lien interne n’y mène.'],['05','Canonique erronée','Elle désigne une autre page que soi.'],['06','Texte dans l’image','Invisible pour le moteur.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>ABORT</b></SpotlightCard>)}</div>
        <div className="red-rule"><span>RULE / 012</span><p>Une intention de recherche mérite une seule page. <strong>Deux pages sur le même sujet ne doublent pas vos chances : elles les divisent.</strong></p></div>
      </Scene>

      <Scene id="checklist" index="12" eyebrow="FINAL PAGE AUDIT" tone="gold"
        title={<>Valider la page.{" "}<br/><em>Avant de la publier.</em></>}
        description="Onze contrôles à passer sur chaque page importante. La progression reste enregistrée sur cet appareil.">
        <div className="audit-console">
          <header><div><span>PRE-PUBLISH / ON-PAGE</span><h3>{score===100?'PAGE READY':'VALIDATION IN PROGRESS'}</h3></div><div className="audit-score"><b>{score}</b><span>%</span></div></header>
          <div className="audit-progress"><i style={{width:`${score}%`}}/></div>
          <div className="audit-list">{checks.map((item,index)=><label key={item} className={checked.includes(index)?'done':''}><input type="checkbox" checked={checked.includes(index)} onChange={()=>toggle(index)}/><i>{checked.includes(index)?'✓':''}</i><span>{item}</span><small>{checked.includes(index)?'PASS':'PENDING'}</small></label>)}</div>
          <footer><span>{checked.length} / {checks.length} CONTROLS PASSED</span><button onClick={()=>{setChecked([]);try{window.localStorage.removeItem('mf-onpage-audit-v1')}catch{/* no-op */}}}>RESET AUDIT</button></footer>
        </div>
        <div className="outro"><span>MENTALITÉ FOCUS / PLAYBOOK 012</span><h3>Une page optimisée ne bat pas une page utile.{" "}<br/><em>Elle la rend trouvable.</em></h3><motion.span whileHover={{y:-5}} style={{display:"inline-block"}}><Link href="/">PLAYBOOK DNS <i>↗</i></Link></motion.span></div>
      </Scene>
    </PlaybookShell>
  );
}
