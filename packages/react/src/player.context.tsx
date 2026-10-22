import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Player } from "./player.types";

const PlayerContext = createContext<Player.Context | null>(null);

function clampIndex(index: number, length: number) {
  if (length <= 0) {
    return 0;
  }
  return Math.min(Math.max(index, 0), length - 1);
}

export type PlayerContextProviderProps = Player.ProviderProps;

export function PlayerContextProvider({
  videos,
  children,
  defaultActiveIndex = 0,
}: PlayerContextProviderProps) {
  const [activeIndex, setActiveIndexState] = useState(() =>
    clampIndex(defaultActiveIndex, videos.length),
  );

  const safeIndex = clampIndex(activeIndex, videos.length);
  const activeVideo = videos[safeIndex];

  const setActiveIndex = (index: number) => {
    setActiveIndexState(clampIndex(index, videos.length));
  };

  const value = useMemo<Player.Context>(
    () => ({
      state: {
        videos,
        activeIndex: safeIndex,
        activeVideo,
      },
      actions: {
        setActiveIndex,
      },
      meta: {},
    }),
    [videos, safeIndex, activeVideo],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayerContext(): Player.Context {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error(
      "PlayerLayout.useContext must be used within PlayerLayout.Provider",
    );
  }
  return context;
}
