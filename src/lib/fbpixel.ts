"use client";

// Minimal wrapper around the global fbq to make event tracking safe in TS/Next
type PixelEventParams = Record<string, unknown> | undefined;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function fbqTrack(event: string, params?: PixelEventParams): void {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") {
    console.warn("Facebook Pixel not loaded - fbq function not available");
    return;
  }
  try {
    console.log(`[Facebook Pixel] Firing event: ${event}`, params);
    if (params) {
      window.fbq("track", event as unknown as never, params as unknown as never);
    } else {
      window.fbq("track", event as unknown as never);
    }
  } catch (error) {
    console.error("Facebook Pixel error:", error);
    // swallow to avoid breaking UX if pixel fails
  }
}

export function fbqPageView(): void {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  try {
    window.fbq("track", "PageView" as unknown as never);
  } catch {
    // no-op
  }
}


