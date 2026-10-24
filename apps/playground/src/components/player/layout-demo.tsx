import { DialRoot } from "dialkit";
import type { ReactNode } from "react";
import { type PlaygroundDialKitMountOptions } from "../dialkit/playground-dialkit";
import { usePlayerLayoutDialKit } from "../player-layout/dialkit";
import { PlayerLayoutShell } from "./layout-shell";

export function PlayerLayoutDemo({
  filter = null,
  header,
  content,
  footer,
  preview = "active",
  layoutMountOptions,
}: {
  filter?: ReactNode;
  header?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  preview?: "active" | "inactive";
  layoutMountOptions?: PlaygroundDialKitMountOptions;
}) {
  const layout = usePlayerLayoutDialKit(layoutMountOptions);

  return (
    <>
      <PlayerLayoutShell
        layout={layout}
        filter={filter}
        header={header}
        content={content}
        footer={footer}
        preview={preview}
        dialMountOptions={layoutMountOptions}
      />
      <DialRoot position="top-right" theme="system" />
    </>
  );
}
