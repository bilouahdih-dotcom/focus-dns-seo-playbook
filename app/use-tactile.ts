"use client";

import { useEffect, useState } from "react";

/**
 * Vrai sur un appareil à pointeur grossier (téléphone, tablette).
 *
 * Sert à retirer ce qui dessert la lecture sur mobile : le smooth scroll
 * JavaScript, qui remplace un défilement géré par le compositeur, et le rendu
 * WebGL continu, qui chauffe et vide la batterie pour un décor.
 *
 * Faux au premier rendu, y compris côté serveur : les effets concernés ne
 * démarrent qu'après le montage, donc rien ne se lance à tort entre-temps.
 */
export function useTactile(): boolean {
  const [tactile, setTactile] = useState(false);

  useEffect(() => {
    const requete = window.matchMedia("(pointer: coarse)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTactile(requete.matches);
    const onChange = (event: MediaQueryListEvent) => setTactile(event.matches);
    requete.addEventListener("change", onChange);
    return () => requete.removeEventListener("change", onChange);
  }, []);

  return tactile;
}
