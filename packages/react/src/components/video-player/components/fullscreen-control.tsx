import { CornersInIcon, CornersOutIcon } from "@phosphor-icons/react"

import { Button } from "@/components/video-player/components/button"
import { FullscreenControl as FullscreenControlPrimitive } from "@/components/limeplay/fullscreen-control"
import { useFullscreenStore } from "@/hooks/limeplay/use-fullscreen"

export function FullscreenControl() {
  const isFullscreenActive = useFullscreenStore((state) => state.active)

  return (
    <FullscreenControlPrimitive asChild shortcut="F">
      <Button className="cursor-pointer" size="icon" variant="glass">
        {isFullscreenActive ? (
          <CornersInIcon weight="bold" />
        ) : (
          <CornersOutIcon weight="bold" />
        )}
      </Button>
    </FullscreenControlPrimitive>
  )
}
