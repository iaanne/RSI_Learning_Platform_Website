import { redirect } from "next/navigation";

export default function RootPage() {
  // Langsung lempar user ke halaman login
  redirect("/auth/login");
}