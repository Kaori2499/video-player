import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PlaygroundDialKitMountOptions } from "../dialkit/playground-dialkit";
import { usePlayerPlaybackDialKit } from "./dialkit";
import { PlayerPlaybackOverlay } from "./playback-overlay";

type PlayerPlaybackContextValue = {
  open: boolean;
  openPlayback: () => void;
  closePlayback: () => void;
  togglePlayback: () => void;
};

const PlayerPlaybackContext = createContext<PlayerPlaybackContextValue | null>(
  null,
);

function shouldIgnorePlaybackShortcut(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return true;
  }
  if (target.isContentEditable) {
    return true;
  }
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }
  if (target.closest(".dialkit-root")) {
    return true;
  }
  return false;
}

export function PlayerPlaybackProvider({
  children,
  dialMountOptions,
  shortcut = true,
}: {
  children: ReactNode;
  dialMountOptions?: PlaygroundDialKitMountOptions;
  /** When false, a parent such as `VideoPlayerBlock` owns the P shortcut. */
  shortcut?: boolean;
}) {
  const overlayMotion = usePlayerPlaybackDialKit(dialMountOptions);
  const [open, setOpen] = useState(false);

  const openPlayback = useCallback(() => setOpen(true), []);
  const closePlayback = useCallback(() => setOpen(false), []);
  const togglePlayback = useCallback(() => setOpen((value) => !value), []);

  const value = useMemo(
    () => ({
      open,
      openPlayback,
      closePlayback,
      togglePlayback,
    }),
    [closePlayback, open, openPlayback, togglePlayback],
  );

  useEffect(() => {
    if (!shortcut) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "p" && event.key !== "P") {
        return;
      }
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }
      if (shouldIgnorePlaybackShortcut(event.target)) {
        return;
      }
      event.preventDefault();
      togglePlayback();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcut, togglePlayback]);

  return (
    <PlayerPlaybackContext.Provider value={value}>
      {children}
      <PlayerPlaybackOverlay
        open={open}
        onClose={closePlayback}
        motion={overlayMotion}
      />
    </PlayerPlaybackContext.Provider>
  );
}

export function usePlayerPlayback() {
  const context = useContext(PlayerPlaybackContext);
  if (!context) {
    throw new Error(
      "usePlayerPlayback must be used within PlayerPlaybackProvider",
    );
  }
  return context;
}

export function usePlayerPlaybackOptional() {
  return useContext(PlayerPlaybackContext);
}
