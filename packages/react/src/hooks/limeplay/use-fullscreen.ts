import React from "react"

import type {
  MediaEventSlice,
  MediaFeature,
} from "@/components/limeplay/media-provider"

import {
  useMediaEvents,
  useMediaFeatureApi,
  useMediaFeatureStore,
} from "@/components/limeplay/media-provider"
import type { PlayerStore } from "@/hooks/limeplay/use-player"
import { usePlayerStore } from "@/hooks/limeplay/use-player"
import { off, on } from "@/lib/utils"

export const FULLSCREEN_FEATURE_KEY = "fullscreen"

export interface FullscreenEvents {
  enterfullscreen: void
  exitfullscreen: void
}

export interface FullscreenStore extends MediaEventSlice<FullscreenEvents> {
  [FULLSCREEN_FEATURE_KEY]: {
    active: boolean
    enter: () => Promise<void>
    exit: () => Promise<void>
    supported: boolean
    toggle: () => Promise<void>
  }
}

type FullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void
  webkitFullscreenElement?: Element | null
  webkitFullscreenEnabled?: boolean
}

type FullscreenHTMLElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

export function fullscreenFeature(): MediaFeature<FullscreenStore> {
  return {
    createSlice: (_set, get) => ({
      [FULLSCREEN_FEATURE_KEY]: {
        active: false,
        enter: async () => {
          const container = (get() as unknown as PlayerStore).player.containerRef
          if (!container) return

          try {
            await requestElementFullscreen(container)
          } catch (error) {
            console.error("Failed to enter fullscreen:", error)
          }
        },
        exit: async () => {
          try {
            await exitDocumentFullscreen()
          } catch (error) {
            console.error("Failed to exit fullscreen:", error)
          }
        },
        supported: false,
        toggle: async () => {
          const fullscreen = get().fullscreen
          if (fullscreen.active) {
            await fullscreen.exit()
          } else {
            await fullscreen.enter()
          }
        },
      },
    }),
    key: FULLSCREEN_FEATURE_KEY,
    Setup: FullscreenSetup,
  }
}

export function useFullscreenStore<TSelected>(
  selector: (state: FullscreenStore["fullscreen"]) => TSelected
): TSelected {
  return useMediaFeatureStore<FullscreenStore, TSelected>(
    FULLSCREEN_FEATURE_KEY,
    (state) => selector(state.fullscreen)
  )
}

function exitDocumentFullscreen(): Promise<void> | void {
  const doc = document as FullscreenDocument
  if (doc.fullscreenElement && doc.exitFullscreen) {
    return doc.exitFullscreen()
  }
  if (doc.webkitFullscreenElement && doc.webkitExitFullscreen) {
    return doc.webkitExitFullscreen()
  }
}

function getFullscreenElement(): Element | null {
  const doc = document as FullscreenDocument
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

function isFullscreenSupported(): boolean {
  if (typeof document === "undefined") return false
  const doc = document as FullscreenDocument
  return Boolean(doc.fullscreenEnabled ?? doc.webkitFullscreenEnabled ?? true)
}

function requestElementFullscreen(element: HTMLElement): Promise<void> | void {
  const target = element as FullscreenHTMLElement
  if (target.requestFullscreen) {
    return target.requestFullscreen()
  }
  if (target.webkitRequestFullscreen) {
    return target.webkitRequestFullscreen()
  }
}

function FullscreenSetup() {
  const store = useMediaFeatureApi<FullscreenStore>(FULLSCREEN_FEATURE_KEY)
  const events = useMediaEvents<FullscreenEvents>()
  const containerRef = usePlayerStore((state) => state.containerRef)

  React.useEffect(() => {
    const syncState = () => {
      const active =
        containerRef !== null && getFullscreenElement() === containerRef

      const previousActive = store.getState().fullscreen.active
      const element = containerRef as FullscreenHTMLElement | null
      const elementSupportsFullscreen =
        element?.requestFullscreen != null ||
        element?.webkitRequestFullscreen != null

      store.setState(({ fullscreen }) => {
        fullscreen.active = active
        fullscreen.supported =
          isFullscreenSupported() &&
          containerRef !== null &&
          elementSupportsFullscreen
      })

      if (!previousActive && active) {
        events.emit("enterfullscreen")
      }
      if (previousActive && !active) {
        events.emit("exitfullscreen")
      }
    }

    syncState()

    on(document, "fullscreenchange", syncState)
    on(document, "webkitfullscreenchange", syncState)

    return () => {
      off(document, "fullscreenchange", syncState)
      off(document, "webkitfullscreenchange", syncState)
    }
  }, [containerRef, events, store])

  return null
}
