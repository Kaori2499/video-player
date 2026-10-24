import { PlayerLayoutDemo } from "../player/layout-demo";

export function PlayerLayoutPage() {
  return (
    <PlayerLayoutDemo
      preview="inactive"
      header={
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          Header
        </div>
      }
      content={
        <div className="flex h-full min-h-[inherit] items-center justify-center text-sm text-neutral-600 dark:text-neutral-300">
          Content
        </div>
      }
      footer={
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          Footer
        </div>
      }
    />
  );
}
