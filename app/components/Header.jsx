import { useEffect, useState } from 'react';

export function Header() {
  const [user, setUser] = useState({ name: '', image: '' });

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    fetchUser();
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-black">
        <div className="flex items-center space-x-4">
          <img
            alt="Profile"
            className="w-12 h-12 rounded-full"
            height="50"
            src={user.image}
            style={{
              aspectRatio: "50/50",
              objectFit: "cover",
            }}
            width="50"
          />
          <h2 className="text-2xl font-serif text-black">{user.name}</h2>
        </div>
        <a href="/api/auth/signout" className="bg-white text-black hover:bg-gray-100 transition-all duration-300 ease-in-out py-2 px-4 rounded-lg text-xl font-serif border border-black shadow-none">
          Sign Out
        </a>
      </header>
  )
}