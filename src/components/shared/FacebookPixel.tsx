"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { fbqPageView } from "@/lib/fbpixel";

export function FacebookPixel(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Fire a PageView on client route changes
    fbqPageView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  return null;
}


