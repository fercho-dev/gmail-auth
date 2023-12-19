import { getUserSession } from "@/lib/session";
import Link from "next/link";

export default async function Home() {
  const user = await getUserSession();
  return (
    <main className="">
      {user ? (
        <div>
          <p className="mb-3">Name: {user.name}</p>
          <p className="mb-3">Email: {user.email}</p>
          <p>Image: {user.image}</p>
          <a href="/api/auth/signout">Sign Out</a>
          <div className="p-[30px]">
            <Link
              href="/chat"
              className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded w-[200px] h-[80px]"
            >
              Obtener Mensajes
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <p>unauthorized</p>
          <a href="/api/auth/signin">Sign In</a>
        </div>
      )}
    </main>
  );
}
