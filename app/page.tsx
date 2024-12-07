import Hero from "@/components/hero";
import MainPage from "@/components/mainpage";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Index() {
  return (
    <>
      {/* <Hero /> */}
      <MainPage />
      <main className="flex-1 flex flex-col gap-6 px-4">
      </main>
    </>
  );
}