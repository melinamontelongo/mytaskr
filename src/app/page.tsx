import Landing from "@/components/landing/Landing";
import Dashboard from "@/components/user/Dashboard";
import { getAuthSession } from "@/lib/auth"

export default async function Home() {
  const session = await getAuthSession();
  if (session?.user) return <Dashboard />;
  return (
    <div>
      <Landing />
    </div>
  )
}
