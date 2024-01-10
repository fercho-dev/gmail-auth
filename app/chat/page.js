"use client";

import { Conversation } from "../components/Conversation";
import { Header } from "../components/Header";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react';

function Chat() {
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        if(!userData.name) {
          router.push('/');
        }
        const currentTime = Math.floor(Date.now() / 1000);
        if (userData.expires_at <= currentTime) {
          await signOut({ redirect: false });
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/');
      }
    }

    fetchUser();
  }, []);

  return (
    <div>
      <Header />
      <Conversation />
    </div>
  );
}

export default Chat;
