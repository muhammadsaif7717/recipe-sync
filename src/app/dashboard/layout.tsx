import Dashnav from '@/components/dashboard/Dashnav';
import React from 'react';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex flex-col'>
      <Dashnav />
      {children}
    </div>
  );
}
