"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { goTo } from "@/lib/nav";

/**
 * Lien de navigation : les ancres (« #roles ») défilent en douceur sur l'accueil,
 * et ramènent à l'accueil depuis les autres pages. Les autres liens passent par le routeur (sans rechargement).
 */
export function SmartLink({ href, onClick, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const pathname = usePathname();
  const isAnchor = href.startsWith("#");
  const onHome = pathname === "/";
  return (
    <Link
      {...props}
      href={isAnchor && !onHome ? `/${href}` : href}
      onClick={(e) => {
        onClick?.(e);
        if (isAnchor && onHome) {
          e.preventDefault();
          goTo(href);
        }
      }}
    />
  );
}
