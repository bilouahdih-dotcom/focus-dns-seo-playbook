"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { PlaybookShell, Scene, SpotlightCard, Protocol } from "../playbook";

const chapters = [
  ["introduction", "Intro"], ["pack", "Pack local"], ["fiche", "Fiche"],
  ["nap", "Cohérence"], ["avis", "Avis"], ["pages", "Pages locales"],
  ["proximite", "Proximité"], ["contenu", "Contenu"], ["reseau", "Réseau"],
  ["erreurs", "Erreurs"], ["checklist", "Checklist"],
] as const;

const checks = [
  "Fiche d'établissement revendiquée et vérifiée",
  "Catégorie principale exacte",
  "Nom, adresse et téléphone identiques partout",
  "Horaires à jour, jours fériés inclus",
  "Zone de service ou adresse définie sans ambiguïté",
  "Photos récentes et représentatives",
  "Avis sollicités auprès de vrais clients",
  "Réponse apportée à chaque avis, négatif compris",
  "Une page dédiée par établissement ou par zone",
  "Coordonnées et plan présents sur le site",
  "Données structurées LocalBusiness en place",
];

export default function SeoLocal() {
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("mf-local-audit-v1");
      // Hydratation client : la valeur n'existe pas au rendu serveur.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setChecked(JSON.parse(saved));
    } catch { /* stockage facultatif */ }
  }, []);

  const toggle = (index: number) => {
    setChecked((current) => {
      const next = current.includes(index) ? current.filter((item) => item !== index) : [...current, index];
      try { window.localStorage.setItem("mf-local-audit-v1", JSON.stringify(next)); } catch { /* no-op */ }
      return next;
    });
  };
  const score = Math.round((checked.length / checks.length) * 100);

  return (
    <PlaybookShell
      current="local"
      chapters={chapters}
      navLinks={[["#fiche", "Fiche"], ["#avis", "Avis"], ["#pages", "Pages"], ["#checklist", "Audit"]]}
      action={["#checklist", "Lancer l’audit"]}
      edition="PLAYBOOK 013 · SEO LOCAL · 2026"
      baseline="On ne cherche pas un service. On cherche un service tout près."
      hero={{
        kicker: "PLAYBOOK 013 / LOCAL SEARCH",
        title: <><span>SEO</span>{" "}<br/><em>LOCAL</em>{" "}<br/>PLAYBOOK</>,
        brief: <>Être trouvé <strong>au bon endroit, au bon moment</strong> : la carte, la fiche, les avis et les pages qui ancrent une activité dans sa ville.</>,
        telemetry: { label: "STATUS", state: "VISIBLE ON THE MAP", detail: "FICHE · AVIS · NAP" },
        wipe: "NEAR ME / RIGHT NOW",
        mark: "MAP",
        coordinate: "48°51′N / 02°21′E · LIVE",
      }}
    >
      <Scene id="pack" index="02" eyebrow="LOCAL PACK / THE REAL BATTLEGROUND" tone="dark"
        title={<>Trois résultats sur la carte.{" "}<br/><em>Puis les liens bleus.</em></>}
        description="Sur une recherche géolocalisée, la carte et ses trois établissements occupent le haut de l'écran. Se classer premier en organique sous ce bloc, c'est arriver quatrième.">
        <div className="manifesto-line"><span>PERTINENCE</span><i>×</i><span>DISTANCE</span><i>×</i><span>NOTORIÉTÉ</span></div>
        <div className="impact-matrix">
          {[['01','Pertinence','La fiche correspond-elle à ce qui est cherché : catégorie, services, mots employés.'],['02','Distance','La position de la personne face à l’établissement. Le seul facteur qui ne se travaille pas.'],['03','Notoriété','Avis, citations, presse locale, popularité du site : ce qui fait exister l’adresse.'],['04','Activité','Fiche tenue, photos récentes, réponses aux avis : un établissement vivant remonte.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>RANKING FACTOR</b></SpotlightCard>)}
        </div>
        <Protocol kind="note" title="Le rapport de force">Une fiche bien tenue rapporte souvent plus vite qu’un mois de <Link href="/seo-off-page">netlinking</Link>. Le local est le seul terrain où un petit acteur bat structurellement un grand.</Protocol>
      </Scene>

      <Scene id="fiche" index="03" eyebrow="BUSINESS PROFILE" tone="light"
        title={<>La fiche est{" "}<br/><em>votre vraie page d&apos;accueil.</em></>}
        description="Beaucoup de clients ne visiteront jamais le site : ils lisent la fiche, regardent les photos, appellent. Elle mérite plus de soin que la page d’accueil.">
        <div className="canonical-stage">
          <div className="incoming-routes"><small>INPUT / SOURCES</small><code><i/>Recherche Google</code><code><i/>Google Maps</code><code><i/>Requête « près de moi »</code></div>
          <div className="redirect-engine"><span>POINT D’ENTRÉE</span><strong>LA FICHE</strong><div className="pulse-arrow">→</div><small>APPEL · ITINÉRAIRE · SITE</small></div>
          <div className="canonical-target"><span>CE QUI DÉCIDE</span><strong>Catégorie exacte</strong><b><i/> + HORAIRES + PHOTOS</b></div>
        </div>
        <div className="protocol-row">
          <Protocol kind="do" title="Le point le plus rentable">La catégorie principale. Elle détermine sur quelles recherches la fiche peut apparaître : « restaurant italien » et « pizzeria » ne concourent pas sur les mêmes requêtes.</Protocol>
          <Protocol kind="avoid" title="À éviter">Ajouter des mots-clés ou une ville dans le nom de l’établissement. Le nom doit être celui de l’enseigne, tel qu’il est sur la devanture.</Protocol>
        </div>
      </Scene>

      <Scene id="nap" index="04" eyebrow="NAP CONSISTENCY" tone="dark"
        title={<>Nom, adresse, téléphone.{" "}<br/><em>Écrits pareil, partout.</em></>}
        description="Ces trois informations servent à reconnaître un établissement à travers le web. Écrites différemment selon les sources, elles décrivent des entités différentes.">
        <div className="record-system">
          {[['NOM','ENSEIGNE','Le nom réel','Sans ville ni mot-clé ajouté'],['ADRESSE','POSTALE','Une seule forme','Même abréviation de rue partout'],['TÉLÉPHONE','LOCAL','Un numéro fixe','Le même sur toutes les fiches']].map(([type,meta,regle,desc])=><SpotlightCard key={type} className="record-module"><header><span>{type}</span><small>{meta}</small></header><h3>{desc}</h3><div><code>{regle}</code><i>→</i><code>PARTOUT</code></div><footer>NAP / CITATIONS</footer></SpotlightCard>)}
        </div>
        <div className="zone-terminal"><header><span>CITATIONS / cohérence</span><b>● ALIGNÉ</b></header><pre><b>SITE</b>       12 rue des Lilas, 75011 Paris{"\n"}<b>FICHE</b>      12 rue des Lilas, 75011 Paris{"\n"}<b>ANNUAIRE</b>   12 rue des Lilas, 75011 Paris{"\n"}<b>RÉSEAUX</b>    12 rue des Lilas, 75011 Paris</pre></div>
        <div className="chain-compare"><div><small>INCOHÉRENT</small><code>12 r. des Lilas / 12 Rue des Lilas</code></div><i>×</i><div><small>ALIGNÉ</small><code>Une seule écriture, partout</code></div></div>
      </Scene>

      <Scene id="avis" index="05" eyebrow="REVIEWS" tone="gold"
        title={<>Les avis ne se{" "}<br/><em>fabriquent pas.</em></>}
        description="Le volume, la fraîcheur, la note et les réponses comptent. Les faux avis sont interdits par les plateformes et sanctionnés par la loi : ils exposent l’entreprise bien au-delà du référencement.">
        <div className="ssl-stage">
          <div className="ssl-seal"><div><span>RYTHME</span><b>RÉGULIER</b><small>MIEUX QUE MASSIF</small></div></div>
          <ol>{[['01','Demander au bon moment, après le service'],['02','Faciliter : un lien direct, rien de plus'],['03','Répondre à tous, sans exception'],['04','Traiter le négatif comme un client, pas un ennemi']].map(([n,t])=><li key={n}><span>{n}</span><b>{t}</b><i>OK</i></li>)}</ol>
        </div>
        <div className="protocol-row">
          <Protocol kind="do" title="Ce qui marche">Une demande simple et personnelle après une prestation réussie. Un lien court, envoyé au bon moment, convertit mieux que n’importe quelle relance automatisée.</Protocol>
          <Protocol kind="avoid" title="Interdit">Acheter des avis, en échanger, ou en offrir la contrepartie. C’est contraire aux règles des plateformes et à la réglementation sur les pratiques commerciales trompeuses.</Protocol>
        </div>
      </Scene>

      <Scene id="pages" index="06" eyebrow="LOCAL LANDING PAGES" tone="light"
        title={<>Une page par lieu.{" "}<br/><em>Pas une page par ville visée.</em></>}
        description="Une page locale utile décrit un établissement réel ou une intervention réelle. Dupliquer un même texte sur trente villes produit trente pages sans valeur.">
        <div className="exposure-table"><header><span>PAGE</span><span>CONTENU</span><span>VALEUR</span><span>ACTION</span></header>
          {[['/agence-lyon','Équipe, adresse, photos, avis','HIGH','GARDER'],['/zone-intervention','Communes couvertes, délais','MEDIUM','ENRICHIR'],['/plombier-ville-A · B · C','Même texte, ville changée','LOW','FUSIONNER'],['/contact','Plan, horaires, téléphone','HIGH','GARDER']].map(([url,contenu,valeur,action])=><div key={url} className={`risk-${valeur.toLowerCase()}`}><code><i/>{url}</code><span>{contenu}</span><b>{valeur}</b><strong>{action}</strong></div>)}
        </div>
        <div className="protocol-row">
          <Protocol kind="do" title="Ce qui rend une page locale crédible">Ce qu’on ne peut pas copier : photos du lieu, noms de l’équipe, chantiers réalisés dans le secteur, plan d’accès, transports.</Protocol>
          <Protocol kind="avoid" title="Le piège classique">Les pages générées par ville. Elles se cannibalisent entre elles et signalent un contenu produit pour le moteur, pas pour un client.</Protocol>
        </div>
      </Scene>

      <Scene id="proximite" index="07" eyebrow="PROXIMITY SIGNALS" tone="dark"
        title={<>La distance décide.{" "}<br/><em>Le reste se travaille.</em></>}
        description="Depuis les recherches sur mobile, la position de la personne pèse énormément. On ne déplace pas un local, mais on peut élargir la zone où l’on reste pertinent.">
        <div className="network-radar">
          <div className="radar-core"><span>@</span><b>ÉTABLISSEMENT</b><small>POINT D’ANCRAGE</small></div>
          <i className="radar-wave w1"/><i className="radar-wave w2"/><i className="radar-wave w3"/>
          {[['0-2 km','très fort'],['2-5 km','fort'],['5-10 km','à travailler'],['+10 km','difficile']].map(([n,t],i)=><div key={n} className={`edge-point p${i+1}`}><i/><span>{n}</span><b>{t}</b></div>)}
        </div>
        <div className="signal-grid">{[['01','Quartier nommé','Employer les noms de quartiers et de repères réels.'],['02','Transports','Métro, gare, axes : ce que les clients utilisent.'],['03','Presse locale','Être cité par les médias et associations du secteur.'],['04','Partenaires','Commerces voisins, réseaux professionnels du coin.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></SpotlightCard>)}</div>
        <Protocol kind="note" title="À accepter">Aucune optimisation ne fera apparaître un établissement en tête à trente kilomètres. Mieux vaut dominer sa zone réelle que viser une ville entière.</Protocol>
      </Scene>

      <Scene id="contenu" index="08" eyebrow="PHOTOS & POSTS" tone="light"
        title={<>Une fiche vivante{" "}<br/><em>bat une fiche parfaite.</em></>}
        description="Les photos sont le premier critère de choix entre deux établissements comparables. Une fiche mise à jour signale une activité réelle, à Google comme aux clients.">
        <div className="verification-stage">
          <ol>{[['01','Devanture, pour être reconnu depuis la rue'],['02','Intérieur, pour se projeter'],['03','Équipe, pour rassurer'],['04','Réalisations récentes, régulièrement']].map(([n,t])=><li key={n}><span>{n}</span><b>{t}</b></li>)}</ol>
          <div className="txt-terminal"><header><span>FICHE / ENTRETIEN</span><b>RYTHME</b></header><dl><div><dt>PHOTOS</dt><dd>MENSUEL</dd></div><div><dt>HORAIRES</dt><dd>FÉRIÉS</dd></div><div><dt>AVIS</dt><dd>48 H</dd></div></dl><small>CE QUI SE VOIT EN PREMIER</small><code>La photo de couverture et <b>les trois derniers avis</b>.</code><footer><i/> ENTRETENU = CHOISI</footer></div>
        </div>
        <Protocol kind="do" title="Réflexe le plus rentable">Mettre à jour les horaires avant chaque période de fermeture. Un client devant une porte close laisse un avis négatif qui coûte des mois.</Protocol>
      </Scene>

      <Scene id="reseau" index="09" eyebrow="MULTI-LOCATION" tone="dark"
        title={<>Plusieurs adresses.{" "}<br/><em>Autant d&apos;identités.</em></>}
        description="Chaque établissement a besoin de sa fiche, de sa page et de ses avis. Les regrouper sur une seule page fait concourir les agences entre elles.">
        <div className="trust-route">{[['01','ÉTABLISSEMENT','FICHE PROPRE'],['02','PAGE DÉDIÉE','SUR LE SITE'],['03','DONNÉES','LOCALBUSINESS'],['✓','RÉSEAU','LISIBLE']].map(([n,t,m],i)=><div key={t} className={i===3?'verified':''}><span>{n}</span><b>{t}</b><small>{m}</small>{i < 3 ? <i>→</i> : null}</div>)}</div>
        <div className="trust-notes">
          <SpotlightCard><span>STRUCTURE</span><h3>Une page par établissement</h3><p>Adresse, horaires, équipe et avis propres à ce point de vente, reliés depuis une page « nos agences » qui sert de sommaire.</p></SpotlightCard>
          <SpotlightCard><span>BALISAGE</span><h3>LocalBusiness par adresse</h3><p>Le balisage doit reprendre exactement les coordonnées affichées, avec un identifiant distinct par établissement.</p></SpotlightCard>
        </div>
        <Protocol kind="note" title="Cas fréquent">Deux fiches créées pour la même adresse, à des époques différentes, se font concurrence. Les fiches en double doivent être fusionnées, pas abandonnées.</Protocol>
      </Scene>

      <Scene id="erreurs" index="10" eyebrow="ANTI-PATTERN DATABASE" tone="danger"
        title={<>Ce qui fait{" "}<br/><em>suspendre une fiche.</em></>}
        description="Les suspensions de fiche sont brutales et longues à corriger. Elles viennent presque toujours des mêmes causes, toutes évitables.">
        <div className="anti-grid">{[['01','Adresse fictive','Boîte postale ou domicile non recevant.'],['02','Mots-clés dans le nom','Le nom doit être celui de l’enseigne.'],['03','Faux avis','Interdits, et sanctionnés par la loi.'],['04','Fiches dupliquées','Deux fiches, une seule adresse.'],['05','Catégorie trompeuse','Elle doit décrire l’activité réelle.'],['06','Horaires abandonnés','Le premier motif d’avis négatif.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>ABORT</b></SpotlightCard>)}</div>
        <div className="red-rule"><span>RULE / 013</span><p>Une fiche décrit un établissement <strong>réel, accessible aux clients, à l’adresse indiquée</strong>. Tout le reste — mots-clés dans le nom, adresses de complaisance, avis fabriqués — se répare rarement vite.</p></div>
      </Scene>

      <Scene id="checklist" index="11" eyebrow="FINAL LOCAL AUDIT" tone="gold"
        title={<>Valider la présence.{" "}<br/><em>Avant de payer de la publicité.</em></>}
        description="Onze contrôles sur la présence locale. La progression reste enregistrée sur cet appareil.">
        <div className="audit-console">
          <header><div><span>PRE-LAUNCH / LOCAL</span><h3>{score===100?'PRESENCE READY':'VALIDATION IN PROGRESS'}</h3></div><div className="audit-score"><b>{score}</b><span>%</span></div></header>
          <div className="audit-progress"><i style={{width:`${score}%`}}/></div>
          <div className="audit-list">{checks.map((item,index)=><label key={item} className={checked.includes(index)?'done':''}><input type="checkbox" checked={checked.includes(index)} onChange={()=>toggle(index)}/><i>{checked.includes(index)?'✓':''}</i><span>{item}</span><small>{checked.includes(index)?'PASS':'PENDING'}</small></label>)}</div>
          <footer><span>{checked.length} / {checks.length} CONTROLS PASSED</span><button onClick={()=>{setChecked([]);try{window.localStorage.removeItem('mf-local-audit-v1')}catch{/* no-op */}}}>RESET AUDIT</button></footer>
        </div>
        <div className="outro"><span>MENTALITÉ FOCUS / PLAYBOOK 013</span><h3>Le local ne récompense pas le plus gros.{" "}<br/><em>Il récompense le mieux tenu.</em></h3><motion.span whileHover={{y:-5}} style={{display:"inline-block"}}><Link href="/seo-technique">PLAYBOOK TECHNIQUE <i>↗</i></Link></motion.span></div>
      </Scene>
    </PlaybookShell>
  );
}
