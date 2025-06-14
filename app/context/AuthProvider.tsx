"use client";

import { getSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      setSession(session);
      setLoading(false);

      // if (!session) {
      //   signOut({ callbackUrl: "/" });
      // } else {
      //   setSession(session);
      //   setLoading(false);
      // }
    };

    checkSession();

    // const interval = setInterval(() => {
    //   checkSession();
    // },  30 * 1000);

    // return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
