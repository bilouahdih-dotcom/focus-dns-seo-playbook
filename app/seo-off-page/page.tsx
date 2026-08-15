"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { PlaybookShell, Scene, SpotlightCard, Protocol } from "../playbook";

const chapters = [
  ["introduction", "Intro"], ["autorite", "Autorité"], ["backlink", "Backlink"],
  ["sources", "Sources"], ["ancres", "Ancres"], ["methodes", "Méthodes"],
  ["marque", "Marque"], ["local", "Local"], ["analyse", "Analyse"],
  ["risques", "Risques"], ["checklist", "Checklist"],
] as const;

const checks = [
  "Pages cibles du netlinking définies",
  "Contenu réellement citable publié",
  "Profil d'ancres varié et naturel",
  "Liens obtenus depuis des sites du même univers",
  "Aucun lien acheté en masse ni échangé en réseau",
  "Mentions de marque non liées identifiées",
  "Fiche Google Business Profile complète et à jour",
  "Coordonnées identiques partout (nom, adresse, téléphone)",
  "Profil de liens surveillé chaque trimestre",
  "Liens cassés vers le site récupérés",
  "Concurrents analysés sur leurs sources de liens",
];

export default function SeoOffPage() {
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("mf-offpage-audit-v1");
      // Hydratation client : la valeur n'existe pas au rendu serveur.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setChecked(JSON.parse(saved));
    } catch { /* stockage facultatif */ }
  }, []);

  const toggle = (index: number) => {
    setChecked((current) => {
      const next = current.includes(index) ? current.filter((item) => item !== index) : [...current, index];
      try { window.localStorage.setItem("mf-offpage-audit-v1", JSON.stringify(next)); } catch { /* no-op */ }
      return next;
    });
  };
  const score = Math.round((checked.length / checks.length) * 100);

  return (
    <PlaybookShell
      current="off-page"
      chapters={chapters}
      navLinks={[["#autorite", "Autorité"], ["#methodes", "Méthodes"], ["#risques", "Risques"], ["#checklist", "Audit"]]}
      action={["#checklist", "Lancer l’audit"]}
      edition="PLAYBOOK 013 · SEO OFF-PAGE · 2026"
      baseline="Votre site dit ce qu'il vaut. Les autres le confirment."
      hero={{
        kicker: "PLAYBOOK 013 / OFF-PAGE AUTHORITY",
        title: <><span>SEO</span>{" "}<br/><em>OFF-PAGE</em>{" "}<br/>PLAYBOOK</>,
        brief: <>Construire une autorité qui <strong>se mérite et se garde</strong> : ce que les autres sites disent de vous compte autant que ce que vous publiez.</>,
        telemetry: { label: "STATUS", state: "AUTHORITY BUILDING", detail: "LIENS · MENTIONS · MARQUE" },
        wipe: "EARNED / NOT BOUGHT",
        mark: "LINK",
        coordinate: "48°51′N / 02°21′E · LIVE",
      }}
    >
      <Scene id="autorite" index="02" eyebrow="OFF-PAGE / WHAT IT REALLY IS" tone="dark"
        title={<>Votre site dit ce qu&apos;il vaut.{" "}<br/><em>Les autres le confirment.</em></>}
        description="Le off-page regroupe tout ce qui se passe en dehors de vos pages : les liens qui pointent vers vous, les mentions de votre marque, et la façon dont votre nom circule.">
        <div className="manifesto-line"><span>LIENS</span><i>×</i><span>MENTIONS</span><i>×</i><span>MARQUE</span><i>×</i><span>CONFIANCE</span></div>
        <div className="impact-matrix">
          {[['01','Popularité','Des sites tiers jugent votre contenu digne d’être cité.'],['02','Pertinence','Ces sites parlent du même univers que vous.'],['03','Confiance','La source est identifiable et a elle-même une réputation.'],['04','Constance','Les liens arrivent dans la durée, pas en une semaine.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>AUTHORITY SIGNAL</b></SpotlightCard>)}
        </div>
        <Protocol kind="note" title="Le principe">Le off-page ne compense jamais une page qui répond mal. Il départage des pages déjà comparables sur le fond.</Protocol>
      </Scene>

      <Scene id="backlink" index="03" eyebrow="ANATOMY OF A LINK" tone="light"
        title={<>Tous les liens{" "}<br/><em>ne se valent pas.</em></>}
        description="Un lien utile est éditorial, contextuel, sur un site du même domaine thématique, et il envoie du trafic réel. Le reste n’est que du volume.">
        <div className="canonical-stage">
          <div className="incoming-routes"><small>INPUT / SIGNAUX</small><code><i/>Contexte éditorial</code><code><i/>Thématique proche</code><code><i/>Trafic réel</code></div>
          <div className="redirect-engine"><span>ÉVALUATION</span><strong>DOFOLLOW</strong><div className="pulse-arrow">→</div><small>LIEN QUI COMPTE</small></div>
          <div className="canonical-target"><span>LIEN DE QUALITÉ</span><strong>Cité dans un article</strong><b><i/> ÉDITORIAL · DURABLE</b></div>
        </div>
        <div className="protocol-row">
          <Protocol kind="do" title="Ce qui compte">Un lien placé dans le corps d’un texte, entouré de contenu sur le même sujet, sur une page elle-même visitée.</Protocol>
          <Protocol kind="avoid" title="Ce qui ne compte pas">Les liens en pied de page sur tout un site, les répertoires sans ligne éditoriale, les commentaires et signatures de forum.</Protocol>
        </div>
      </Scene>

      <Scene id="sources" index="04" eyebrow="LINK SOURCES" tone="dark"
        title={<>Trois familles de sources.{" "}<br/><em>Trois efforts différents.</em></>}
        description="Un profil de liens sain mélange des origines variées. En dépendre d’une seule est le signal le plus facile à repérer.">
        <div className="record-system">
          {[['PRESSE','MÉDIA','Difficile','Article, étude citée, interview'],['MÉTIER','SECTORIEL','Moyen','Annuaire pro, syndicat, partenaire'],['CONTENU','ORGANIQUE','Long','Outil, donnée, guide de référence']].map(([type,meta,effort,desc])=><SpotlightCard key={type} className="record-module"><header><span>{type}</span><small>{meta}</small></header><h3>{desc}</h3><div><code>EFFORT</code><i>→</i><code>{effort}</code></div><footer>SOURCE / LIENS</footer></SpotlightCard>)}
        </div>
        <div className="zone-terminal"><header><span>PROFIL / sain</span><b>● VARIÉ</b></header><pre><b>MÉDIA</b>       12 domaines{"\n"}<b>SECTORIEL</b>   28 domaines{"\n"}<b>PARTENAIRE</b>  9 domaines{"\n"}<b>ORGANIQUE</b>   64 domaines</pre></div>
        <div className="chain-compare"><div><small>PROFIL / SUSPECT</small><code>1 source, 200 liens</code></div><i>×</i><div><small>PROFIL / SOLIDE</small><code>113 domaines, 4 familles</code></div></div>
      </Scene>

      <Scene id="ancres" index="05" eyebrow="ANCHOR DISTRIBUTION" tone="gold"
        title={<>L&apos;ancre parfaite{" "}<br/><em>n&apos;existe pas.</em></>}
        description="Un profil naturel mélange la marque, l’URL nue, des formulations génériques et, minoritairement, le mot-clé exact. L’excès d’ancres optimisées est le motif classique de pénalité.">
        <div className="ssl-stage">
          <div className="ssl-seal"><div><span>ANCRE EXACTE</span><b>&lt;15%</b><small>DU PROFIL TOTAL</small></div></div>
          <ol>{[['01','Marque et nom de domaine'],['02','URL brute'],['03','Formulation naturelle de phrase'],['04','Mot-clé exact, en minorité']].map(([n,t])=><li key={n}><span>{n}</span><b>{t}</b><i>OK</i></li>)}</ol>
        </div>
        <div className="protocol-row">
          <Protocol kind="do" title="Repère">Regardez le profil d’ancres de trois concurrents installés : la marque y domine presque toujours.</Protocol>
          <Protocol kind="avoid" title="Signal d’alerte">Cent liens portant la même ancre commerciale n’arrivent jamais naturellement, et se repèrent immédiatement.</Protocol>
        </div>
      </Scene>

      <Scene id="methodes" index="06" eyebrow="EARNING LINKS" tone="dark"
        title={<>Obtenir des liens{" "}<br/><em>sans les acheter.</em></>}
        description="Les méthodes durables reposent sur une contrepartie réelle : une donnée, un outil, une expertise ou une relation. Elles demandent du temps et résistent aux mises à jour.">
        <div className="network-radar">
          <div className="radar-core"><span>C</span><b>ACTIF CITABLE</b><small>CE QUI ATTIRE LE LIEN</small></div>
          <i className="radar-wave w1"/><i className="radar-wave w2"/><i className="radar-wave w3"/>
          {[['ÉTUDE','données propres'],['OUTIL','gratuit et utile'],['EXPERTISE','avis cité'],['RELATION','partenaires']].map(([n,t],i)=><div key={n} className={`edge-point p${i+1}`}><i/><span>{n}</span><b>{t}</b></div>)}
        </div>
        <div className="signal-grid">{[['01','Publier une donnée','Un chiffre original se cite tout seul.'],['02','Réparer les liens cassés','Signaler un lien mort et proposer le vôtre.'],['03','Être une source','Répondre aux journalistes du secteur.'],['04','Activer l’existant','Clients, fournisseurs, écoles, associations.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></SpotlightCard>)}</div>
        <Protocol kind="note" title="Question de contrôle">Avant de demander un lien, demandez-vous pourquoi ce site accepterait. Sans réponse claire, la demande sera ignorée.</Protocol>
      </Scene>

      <Scene id="marque" index="07" eyebrow="BRAND SIGNALS" tone="light"
        title={<>On parle de vous{" "}<br/><em>sans vous lier.</em></>}
        description="Les mentions sans lien, les recherches sur votre nom et les avis construisent une notoriété que les moteurs savent lire. C’est le off-page le moins exploité.">
        <div className="verification-stage">
          <ol>{[['01','Suivre les mentions de la marque'],['02','Demander le lien quand la mention existe'],['03','Répondre aux avis, publics et négatifs'],['04','Faire croître les recherches de marque']].map(([n,t])=><li key={n}><span>{n}</span><b>{t}</b></li>)}</ol>
          <div className="txt-terminal"><header><span>MENTION / SANS LIEN</span><b>À CONVERTIR</b></header><dl><div><dt>SOURCE</dt><dd>MÉDIA</dd></div><div><dt>TON</dt><dd>POSITIF</dd></div><div><dt>LIEN</dt><dd>NON</dd></div></dl><small>MESSAGE TYPE</small><code>« Merci pour la citation. Un lien vers <b>la page source</b> aiderait vos lecteurs. »</code><footer><i/> DEMANDE SIMPLE ET UTILE</footer></div>
        </div>
        <Protocol kind="do" title="Le réflexe">Une alerte sur le nom de la marque suffit à repérer chaque semaine les mentions à transformer en liens.</Protocol>
      </Scene>

      <Scene id="local" index="08" eyebrow="LOCAL & CITATIONS" tone="dark"
        title={<>Pour un commerce,{" "}<br/><em>la carte prime.</em></>}
        description="En local, la fiche d’établissement et la cohérence des coordonnées pèsent plus lourd que le nombre de liens. Une adresse écrite différemment partout brouille le signal.">
        <div className="trust-route">{[['01','FICHE','GOOGLE'],['02','CITATIONS','ANNUAIRES'],['03','AVIS','CLIENTS'],['✓','CARTE','VISIBLE']].map(([n,t,m],i)=><div key={t} className={i===3?'verified':''}><span>{n}</span><b>{t}</b><small>{m}</small>{i < 3 ? <i>→</i> : null}</div>)}</div>
        <div className="trust-notes">
          <SpotlightCard><span>COHÉRENCE</span><h3>Nom, adresse, téléphone</h3><p>Exactement la même écriture sur la fiche, le site et chaque annuaire. Les variations diluent la reconnaissance de l’établissement.</p></SpotlightCard>
          <SpotlightCard><span>ACTIVITÉ</span><h3>Une fiche vivante</h3><p>Photos récentes, horaires exacts, réponses aux avis : une fiche entretenue ressort devant une fiche abandonnée.</p></SpotlightCard>
        </div>
        <Protocol kind="note" title="Priorité">Pour une activité locale, une fiche complète et des avis réguliers rapportent plus vite que n’importe quelle campagne de liens.</Protocol>
      </Scene>

      <Scene id="analyse" index="09" eyebrow="PROFILE ANALYSIS" tone="light"
        title={<>Mesurer les domaines.{" "}<br/><em>Pas les liens.</em></>}
        description="Cent liens d’un même site valent un domaine. Ce qui compte, c’est le nombre de domaines distincts, leur pertinence et leur évolution dans le temps.">
        <div className="exposure-table"><header><span>INDICATEUR</span><span>CE QU’IL DIT</span><span>PRIORITÉ</span><span>ACTION</span></header>
          {[['Domaines référents','Ampleur réelle du profil','HIGH','SUIVRE AU MOIS'],['Pertinence thématique','Cohérence du voisinage','HIGH','VÉRIFIER À LA MAIN'],['Trafic de la page source','Le lien est-il vu','MEDIUM','ARBITRER'],['Nombre de liens total','Peu significatif seul','LOW','NE PAS VISER']].map(([ind,sens,prio,action])=><div key={ind} className={`risk-${prio.toLowerCase()}`}><code><i/>{ind}</code><span>{sens}</span><b>{prio}</b><strong>{action}</strong></div>)}
        </div>
        <div className="protocol-row">
          <Protocol kind="do" title="Comparer">Analysez d’où viennent les liens de trois concurrents qui vous dépassent : la liste des sources est votre plan de travail.</Protocol>
          <Protocol kind="avoid" title="Fausse piste">Les scores d’autorité des outils ne sont pas des mesures de Google. Ce sont des indices, pas des objectifs.</Protocol>
        </div>
      </Scene>

      <Scene id="risques" index="10" eyebrow="ANTI-PATTERN DATABASE" tone="danger"
        title={<>Les raccourcis{" "}<br/><em>finissent par se voir.</em></>}
        description="Les consignes de Google interdisent les liens destinés à manipuler le classement. Les schémas ci-dessous sont détectés, et leur correction coûte plus cher que le gain espéré.">
        <div className="anti-grid">{[['01','Achat de liens en masse','Empreinte repérable, gain annulé.'],['02','Réseaux de sites (PBN)','Même hébergement, mêmes signatures.'],['03','Échanges systématiques','Liens croisés sans logique éditoriale.'],['04','Articles sponsorisés non déclarés','À marquer en sponsored ou nofollow.'],['05','Annuaires sans ligne éditoriale','Aucun lecteur, aucun effet.'],['06','Ancres suroptimisées','Le motif le plus simple à détecter.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>ABORT</b></SpotlightCard>)}</div>
        <div className="red-rule"><span>RULE / 013</span><p>Un lien payé doit être déclaré avec l’attribut <strong>sponsored</strong>, et un contenu invité avec <strong>nofollow</strong> ou <strong>ugc</strong>. Déclarer un lien ne le rend pas inutile : cela évite qu’il devienne un problème.</p></div>
      </Scene>

      <Scene id="checklist" index="11" eyebrow="FINAL AUTHORITY AUDIT" tone="gold"
        title={<>Valider la stratégie.{" "}<br/><em>Avant d&apos;investir.</em></>}
        description="Onze contrôles avant de lancer ou de reprendre un travail de netlinking. La progression reste enregistrée sur cet appareil.">
        <div className="audit-console">
          <header><div><span>PRE-CAMPAIGN / OFF-PAGE</span><h3>{score===100?'STRATEGY READY':'VALIDATION IN PROGRESS'}</h3></div><div className="audit-score"><b>{score}</b><span>%</span></div></header>
          <div className="audit-progress"><i style={{width:`${score}%`}}/></div>
          <div className="audit-list">{checks.map((item,index)=><label key={item} className={checked.includes(index)?'done':''}><input type="checkbox" checked={checked.includes(index)} onChange={()=>toggle(index)}/><i>{checked.includes(index)?'✓':''}</i><span>{item}</span><small>{checked.includes(index)?'PASS':'PENDING'}</small></label>)}</div>
          <footer><span>{checked.length} / {checks.length} CONTROLS PASSED</span><button onClick={()=>{setChecked([]);try{window.localStorage.removeItem('mf-offpage-audit-v1')}catch{/* no-op */}}}>RESET AUDIT</button></footer>
        </div>
        <div className="outro"><span>MENTALITÉ FOCUS / PLAYBOOK 013</span><h3>L&apos;autorité ne s&apos;achète pas.{" "}<br/><em>Elle se construit, puis se garde.</em></h3><motion.span whileHover={{y:-5}} style={{display:"inline-block"}}><Link href="/seo-on-page">PLAYBOOK ON-PAGE <i>↗</i></Link></motion.span></div>
      </Scene>
    </PlaybookShell>
  );
}
