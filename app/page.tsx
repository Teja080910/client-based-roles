"use client";

import DashboardPage from "./dashboard/page";

export default function Home() {

  console.log("date now in app file", new Date(Date.now()).toLocaleString())

  return <DashboardPage />;
}
