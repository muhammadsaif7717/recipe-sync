'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Home, Shield } from 'lucide-react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { ThemeToggle } from '../shared/ThemeToggle';

export default function Dashnav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = session.data?.user?.role === 'admin';

  return (
    <div className='px-4 py-5 pb-0 sm:px-6 lg:px-8'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-bold text-slate-900 md:text-3xl dark:text-slate-50'>
              {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
            </h1>
            <p className='mt-2 text-sm text-slate-600 md:text-xl dark:text-slate-300'>
              Welcome back, {session.data?.user?.name}
            </p>
            {isAdmin && (
              <div className='mt-2 flex w-24 items-center space-x-2 rounded-full bg-emerald-100 px-3 py-1 dark:bg-emerald-900/20'>
                <Shield className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                <span className='text-sm text-emerald-700 dark:text-emerald-300'>
                  Admin
                </span>
              </div>
            )}
          </div>
          <div className='flex items-center gap-2 lg:gap-4'>
            <ThemeToggle />
            {/* User Avatar Dropdown */}
            <div className='relative' ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='flex items-center space-x-2 rounded-full p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800'
              >
                <Image
                  height={40}
                  width={40}
                  src={session.data?.user?.image || '/api/placeholder/40/40'}
                  alt='Avatar'
                  className='h-10 w-10 rounded-full border-2 border-slate-200 dark:border-slate-700'
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className='absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-2 shadow-lg dark:border-slate-700 dark:bg-slate-900'
                  >
                    {/* User Info */}
                    <div className='border-b border-slate-200 px-4 py-3 dark:border-slate-700'>
                      <p className='text-sm font-medium text-slate-900 dark:text-slate-50'>
                        {session.data?.user?.name}
                      </p>
                      <p className='text-xs text-slate-500 dark:text-slate-400'>
                        {session.data?.user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className='py-1'>
                      <Link
                        href='/'
                        className='flex items-center px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Home className='mr-3 h-4 w-4' />
                        <span>Home</span>
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          signOut();
                        }}
                        className='flex w-full items-center px-4 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20'
                      >
                        <LogOut className='mr-3 h-4 w-4' />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
