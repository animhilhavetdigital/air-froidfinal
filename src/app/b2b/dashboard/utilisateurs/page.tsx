"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UtilisateursRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/b2b/dashboard/utilisateurs/personnel");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="font-montserrat text-gray-500 text-sm">Redirection...</div>
    </div>
  );
}
