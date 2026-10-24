"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { Button } from "@/components/video-player/components/button"
import { useFullscreenStore } from "@/hooks/limeplay/use-fullscreen"
import {
  MediaReadyState,
  usePlaybackStore,
} from "@/hooks/limeplay/use-playback"

export interface FullscreenControlProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Render as child component using Radix Slot
   * @default false
   */
  asChild?: boolean
  render?: React.ReactElement
  /**
   * Keyboard shortcut hint displayed in aria-label
   * @example "F"
   */
  shortcut?: string
}

export type FullscreenControlPropsDocs = Pick<
  FullscreenControlProps,
  "asChild" | "render" | "shortcut"
>

export const FullscreenControl = React.forwardRef<
  HTMLButtonElement,
  FullscreenControlProps
>((props, forwardedRef) => {
  const readyState = usePlaybackStore((state) => state.readyState)
  const isFullscreenActive = useFullscreenStore((state) => state.active)
  const isFullscreenSupported = useFullscreenStore((state) => state.supported)
  const toggle = useFullscreenStore((state) => state.toggle)

  const {
    "aria-label": ariaLabelProp,
    asChild = false,
    children,
    disabled: userDisabled,
    onClick,
    render,
    shortcut,
    ...restProps
  } = props

  const Comp = render ? Slot : asChild ? Slot : Button

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) {
      await toggle()
    }
  }

  const isDisabled =
    readyState < MediaReadyState.HAVE_METADATA ||
    !isFullscreenSupported ||
    userDisabled

  const getDefaultAriaLabel = () => {
    const shortcutText = shortcut ? ` (keyboard shortcut ${shortcut})` : ""
    const label = isFullscreenActive ? "Exit full screen" : "Enter full screen"
    return `${label}${shortcutText}`
  }

  return (
    <Comp
      aria-keyshortcuts={shortcut}
      aria-label={ariaLabelProp ?? getDefaultAriaLabel()}
      aria-pressed={isFullscreenActive}
      data-label="lp-fullscreen-control"
      disabled={isDisabled}
      {...restProps}
      onClick={handleClick}
      ref={forwardedRef}
    >
      {render ? React.cloneElement(render, undefined, children) : children}
    </Comp>
  )
})

FullscreenControl.displayName = "FullscreenControl"
