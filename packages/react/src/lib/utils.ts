import type React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDeviceLanguage() {
  const primaryLocale = navigator.language
  return primaryLocale.split("-")[0]
}

export function noop() {
  // noop
}

export function off<R extends HTMLElement>(
  element: EventTarget,
  events: string | string[],
  callback: (event: React.SyntheticEvent<R>) => void
): EventTarget
export function off(
  element: EventTarget,
  events: string | string[],
  callback: (event: any) => void
): EventTarget {
  if (Array.isArray(events)) {
    events.forEach((event) => {
      element.removeEventListener(event, callback as EventListener)
    })
  } else {
    element.removeEventListener(events, callback as EventListener)
  }
  return element
}

export function on<R extends HTMLElement>(
  element: EventTarget,
  events: string | string[],
  callback: (event: React.SyntheticEvent<R>) => void
): EventTarget
export function on(
  element: EventTarget,
  events: string | string[],
  callback: (event: any) => void
): EventTarget {
  if (Array.isArray(events)) {
    events.forEach((event) => {
      element.addEventListener(event, callback as EventListener)
    })
  } else {
    element.addEventListener(events, callback as EventListener)
  }
  return element
}

export function toFixedNumber(num: number, digits: number, base = 10) {
  const pow = Math.pow(base, digits)
  return Math.round(num * pow) / pow
}
