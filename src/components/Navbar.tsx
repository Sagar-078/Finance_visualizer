"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      const name = email.split("@")[0].split(/[0-9]/)[0];
      setUser(name);
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow mb-6">
      <h1 className="text-2xl font-bold text-indigo-600">💸 Finance Visualizer</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-gray-800 font-medium">Hi, {user}</span>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}