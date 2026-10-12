"use client";

import { AiOutlinePauseCircle, AiOutlinePlayCircle } from "react-icons/ai";

import { useGlobalStore } from "@/store/globalStore";

export default function ShowcaseToggle() {
  const { gs, set } = useGlobalStore();

  const handleShowcaseToggle = () => {
    // A teljes képernyőt csak felhasználói kattintásra engedi a böngésző, ezért itt kérjük
    if (!gs.showcase) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    set("showcase", !gs.showcase);
  };

  return (
    <button
      className="cursor-pointer px-2 py-2 text-gray-500 transition hover:scale-120 hover:text-gray-800 dark:hover:text-white/50"
      title={gs.showcase ? "Kirakati bemutató leállítása" : "Kirakati bemutató indítása"}
      onClick={handleShowcaseToggle}
    >
      {gs.showcase ? <AiOutlinePauseCircle size={24} /> : <AiOutlinePlayCircle size={24} />}
    </button>
  );
}
