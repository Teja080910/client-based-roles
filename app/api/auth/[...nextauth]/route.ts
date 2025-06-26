import { authOptions } from "@/lib/next-auth-options";
import NextAuth from "next-auth";

console.log("date now in auth file", new Date(Date.now()).toLocaleString())

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST };
