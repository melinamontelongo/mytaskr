import Dashboard from "@/components/user/Dashboard";
import { getAuthSession } from "@/lib/auth"

export default async function Home() {
  const session = await getAuthSession();
  if (session?.user) return <Dashboard />;
  return (
    <div className="grid place-content-center h-screen">
      <h1 className="font-extrabold sm:text-5xl drop-shadow-md">Your tasks made easier.</h1>
    </div>
  )
}
