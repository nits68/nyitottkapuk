"use client";

import { useEffect } from "react";

import { useGlobalStore } from "@/store/globalStore";

// Görgetési sebesség (pixel / másodperc)
const SCROLL_SPEED = 60;
// Ennyi ideig marad nyitva egy záródolgozat
const PROJECT_DWELL_MS = 10000;
// Ennyit vár az oldal alján és tetején, mielőtt újrakezdi
const EDGE_PAUSE_MS = 4000;
// A fix fejléc alatti sáv, amit a kibontott munka teteje nem takarhat ki
const NAVBAR_OFFSET = 80;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isAtBottom = () =>
  window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

// A kirakati bemutatót vezérlő komponens: nem jelenít meg semmit, csak görgeti az oldalt
export default function Showcase() {
  const { gs, set } = useGlobalStore();

  // Kilépés a teljes képernyőből (pl. Esc) a bemutatót is leállítja
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) set("showcase", false);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [set]);

  useEffect(() => {
    if (!gs.showcase) return;

    let active = true;
    let wakeLock: WakeLockSentinel | null = null;

    // A kijelző ne kapcsoljon ki a bemutató alatt (ha a böngésző támogatja)
    navigator.wakeLock
      ?.request("screen")
      .then((lock) => {
        if (active) wakeLock = lock;
        else lock.release();
      })
      .catch(() => {});

    // Egyenletesen lefelé görget, amíg a feltétel nem teljesül vagy el nem érjük az alját
    const scrollUntil = (done: () => boolean) =>
      new Promise<void>((resolve) => {
        let y = window.scrollY;
        let last = performance.now();
        const step = (now: number) => {
          if (!active || done() || isAtBottom()) return resolve();
          // Ha a látogató közben odébb görgetett, onnan folytatjuk
          if (Math.abs(window.scrollY - y) > 5) y = window.scrollY;
          y += (SCROLL_SPEED * (now - last)) / 1000;
          last = now;
          // "instant": a html elem scroll-behavior: smooth beállítása ne lassítsa a lépéseket
          window.scrollTo({ top: y, behavior: "instant" });
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });

    const showProjects = async () => {
      const items = document.querySelectorAll<HTMLElement>("#portfolio [data-project]");
      for (let i = 0; i < items.length && active; i++) {
        set("expandedProject", i);
        await sleep(600); // a kinyílás animációja
        // Addig görgetünk, amíg a kibontott munka teljesen látszik
        await scrollUntil(() => {
          const rect = items[i].getBoundingClientRect();
          return rect.bottom <= window.innerHeight - 20 || rect.top <= NAVBAR_OFFSET;
        });
        await sleep(PROJECT_DWELL_MS);
      }
      if (active) set("expandedProject", null);
    };

    const run = async () => {
      while (active) {
        window.scrollTo({ top: 0, behavior: "instant" });
        await sleep(EDGE_PAUSE_MS);

        // Görgetés a záródolgozatokig, ott egyenként kibontjuk őket
        const portfolio = document.getElementById("portfolio");
        await scrollUntil(() => !portfolio || portfolio.getBoundingClientRect().top <= 0);
        if (!active) return;
        await showProjects();

        // Tovább az oldal aljáig, majd elölről
        await scrollUntil(() => false);
        await sleep(EDGE_PAUSE_MS);
      }
    };
    run();

    return () => {
      active = false;
      wakeLock?.release();
    };
  }, [gs.showcase, set]);

  return null;
}
