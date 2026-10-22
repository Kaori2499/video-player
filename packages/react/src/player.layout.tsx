import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";
import { createContext, useContext } from "react";
import {
  PlayerContextProvider,
  usePlayerContext,
  type PlayerContextProviderProps,
} from "./player.context";
import type { Player } from "./player.types";

type PlayerLayoutShellContextValue = {
  layoutId: string;
};

const PlayerLayoutShellContext =
  createContext<PlayerLayoutShellContextValue | null>(null);

function usePlayerLayoutShellContext(component: string) {
  const context = useContext(PlayerLayoutShellContext);
  if (!context) {
    throw new Error(
      `PlayerLayout.${component} must be used within PlayerLayout.Root`,
    );
  }
  return context;
}

const layoutRootClassName =
  "relative isolate grid h-dvh min-h-dvh w-full grid-cols-1 grid-rows-[auto_1fr_auto] overflow-hidden";

const layoutBackgroundClassName =
  "pointer-events-none absolute inset-0 z-0 box-border h-full w-full border-2 border-neutral-600 bg-neutral-500/10 dark:border-neutral-700 dark:bg-white/5";

const layoutFilterClassName =
  "pointer-events-none absolute inset-0 z-[1] box-border h-full w-full border-2 border-dotted border-neutral-500/80 dark:border-neutral-400/60";

const layoutRegionClassName =
  "relative box-border min-h-12 border-2 border-dashed border-neutral-400 dark:border-neutral-500";

export type PlayerLayoutRootProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

function PlayerLayoutRoot({
  children,
  className,
  ...props
}: PlayerLayoutRootProps) {
  return (
    <PlayerLayoutShellContext.Provider value={{ layoutId: "player.layout" }}>
      <div
        data-vp-layout=""
        className={cn(layoutRootClassName, className)}
        {...props}
      >
        {children}
      </div>
    </PlayerLayoutShellContext.Provider>
  );
}

export type PlayerLayoutRegionProps = HTMLAttributes<HTMLElement>;

export type PlayerLayoutBackgroundProps = HTMLAttributes<HTMLDivElement>;

function PlayerLayoutBackground({
  className,
  children,
  ...props
}: PlayerLayoutBackgroundProps) {
  usePlayerLayoutShellContext("Background");

  return (
    <div
      aria-hidden={children ? undefined : true}
      data-vp-layout-region="background"
      className={cn(layoutBackgroundClassName, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type PlayerLayoutFilterProps = HTMLAttributes<HTMLDivElement>;

function PlayerLayoutFilter({
  className,
  children,
  ...props
}: PlayerLayoutFilterProps) {
  usePlayerLayoutShellContext("Filter");

  return (
    <div
      aria-hidden={children ? undefined : true}
      data-vp-layout-region="filter"
      className={cn(layoutFilterClassName, className)}
      {...props}
    >
      {children}
    </div>
  );
}

function PlayerLayoutHeader({
  className,
  children,
  ...props
}: PlayerLayoutRegionProps) {
  usePlayerLayoutShellContext("Header");

  return (
    <header
      data-vp-layout-region="header"
      className={cn(
        layoutRegionClassName,
        "z-30 min-h-14 shrink-0",
        className,
      )}
      {...props}
    >
      {children}
    </header>
  );
}

function PlayerLayoutContent({
  className,
  children,
  ...props
}: PlayerLayoutRegionProps) {
  usePlayerLayoutShellContext("Content");

  return (
    <main
      data-vp-layout-region="content"
      className={cn(layoutRegionClassName, "z-10 min-h-0", className)}
      {...props}
    >
      {children}
    </main>
  );
}

function PlayerLayoutFooter({
  className,
  children,
  ...props
}: PlayerLayoutRegionProps) {
  usePlayerLayoutShellContext("Footer");

  return (
    <footer
      data-vp-layout-region="footer"
      className={cn(
        layoutRegionClassName,
        "z-20 min-h-16 shrink-0",
        className,
      )}
      {...props}
    >
      {children}
    </footer>
  );
}

function PlayerLayoutProvider(props: PlayerContextProviderProps) {
  return <PlayerContextProvider {...props} />;
}

export const PlayerLayout = {
  Provider: PlayerLayoutProvider,
  Root: PlayerLayoutRoot,
  Background: PlayerLayoutBackground,
  Filter: PlayerLayoutFilter,
  Header: PlayerLayoutHeader,
  Content: PlayerLayoutContent,
  Footer: PlayerLayoutFooter,
  useContext: usePlayerContext,
};

// Re-export namespace type for consumers that import Player from the layout module.
export type { Player };
