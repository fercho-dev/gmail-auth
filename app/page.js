import { getUserSession } from "@/lib/session";
import Link from "next/link";
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await getUserSession();
  return (
    <main className="">
      <section className="w-full h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 flex flex-col">
          <h1 className="text-5xl font-serif text-black">Welcome to Our Website</h1>
          <p className="text-xl font-serif text-black max-w-md mx-auto">
            We offer the best services. Join us and be part of our amazing community.
          </p>
          
        </div>
      </section>
    </main>
  );
}
