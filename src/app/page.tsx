'use client';
import Banner from '@/components/root/Banner';
import { useSession } from 'next-auth/react';

export default function Home() {
  const session = useSession();
  console.log(session);
  return (
    <main>
      <Banner />
    </main>
  );
}
