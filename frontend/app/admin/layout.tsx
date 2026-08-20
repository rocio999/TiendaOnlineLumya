"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") {
      return;
    }

    const adminId = localStorage.getItem("adminId");
    const token = localStorage.getItem("token");

    if (!adminId || !token) {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

  return <>{children}</>;
}