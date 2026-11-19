import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import App from "@/components/App";

export const dynamic = "force-dynamic";

export default async function Home() {
  const me = await currentUser();
  if (!me) redirect("/login");
  return <App me={me} />;
}
