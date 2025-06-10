"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl font-semibold mb-4">Login Page</h1>
      <button
        onClick={() => signIn("keycloak", { callbackUrl: "/" })}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Login with Keycloak
      </button>
    </div>
  );
}
