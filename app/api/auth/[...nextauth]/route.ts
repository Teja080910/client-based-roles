import { authOptions } from "@/lib/next-auth-options";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions)

console.log("date now in auth file", new Date(Date.now()).toLocaleString())

export { handler as GET, handler as POST };
