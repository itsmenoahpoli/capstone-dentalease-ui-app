"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const AppBreadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const segments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname]
  );

  const paths = useMemo(() => {
    let acc = "";
    return segments.map((segment) => {
      acc += "/" + segment;
      return acc;
    });
  }, [segments]);

  return (
    <nav className="flex items-center space-x-1 text-xs">
      <Link href="/">Home</Link>
      {segments.map((segment, idx) => {
        const isLast = idx === segments.length - 1;
        const path = paths[idx];
        return (
          <span key={path} className="flex items-center capitalize">
            <span className="mx-1">/</span>
            {isLast ? (
              <span className="text-gray-500 font-medium">
                {decodeURIComponent(segment)}
              </span>
            ) : (
              <Link href={path}>{decodeURIComponent(segment)}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};
