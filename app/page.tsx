"use client";

import { getSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import ManageRolesPage from "./dashboard/page";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>();

  const checkSession = async () => {
    const session = await getSession();
    console.log("Session:", session);
    setSession(session);
    setIsAuthenticated(!!session);
    setLoading(false);
  };

  useEffect(() => {
    checkSession();
  }, []);

  return <ManageRolesPage session={session} loading={loading} />;
}
