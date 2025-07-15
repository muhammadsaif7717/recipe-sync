'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChefHat,
  Home,
  BookOpen,
  Plus,
  LogIn,
  Notebook,
  LogOut,
  User,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/recipe', label: 'Recipes', icon: BookOpen },
  { href: '/add-recipe', label: 'Add Recipe', icon: Plus },
  // { href: '/blogs', label: 'Blogs', icon: PenTool },
  { href: '/about-us', label: 'About Us', icon: Notebook },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const session = useSession();

  // Mock user state - replace with actual auth later
  const user = session.data?.user; // Will be replaced with NextAuth session

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobile = () => setIsOpen(!isOpen);

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/auth')) {
    return null;
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-slate-200/50 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/80'
            : 'bg-transparent'
        }`}
      >
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            {/* Logo */}
            <Link href='/' className='group flex items-center space-x-2'>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className='relative'
              >
                <ChefHat className='h-8 w-8 text-emerald-500 dark:text-emerald-400' />
                <motion.div
                  className='absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20'
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <span className='bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-xl font-bold text-transparent dark:from-emerald-400 dark:to-amber-400'>
                RecipeSync
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden items-center space-x-1 md:flex'>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      className={`relative flex items-center space-x-2 rounded-xl px-4 py-2 transition-all duration-200 ${
                        isActive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className='h-4 w-4' />
                      <span className='font-medium'>{item.label}</span>

                      {isActive && (
                        <motion.div
                          layoutId='activeTab'
                          className='absolute inset-0 -z-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30'
                          initial={false}
                          transition={{
                            type: 'spring',
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className='flex items-center gap-2 lg:gap-4'>
              <ThemeToggle />
              {/* User Section */}
              {session.status === 'authenticated' ? (
                <div className='hidden md:block'>
                  <div className='relative' ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className='flex items-center space-x-2 rounded-full p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800'
                    >
                      <Image
                        height={40}
                        width={40}
                        src={
                          session.data?.user?.image || '/api/placeholder/40/40'
                        }
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
                              href='/dashboard'
                              className='flex items-center px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <User className='mr-3 h-4 w-4' />
                              Dashboard
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
              ) : (
                <Link href='/auth/sign-in' className='hidden md:block'>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='flex items-center space-x-2 rounded-xl bg-emerald-500 px-4 py-2 font-medium text-white shadow-lg transition-colors hover:bg-emerald-600 hover:shadow-emerald-500/25 dark:bg-emerald-500 dark:hover:bg-emerald-600'
                  >
                    <LogIn className='h-4 w-4' />
                    <span>Sign In</span>
                  </motion.button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleMobile}
                className='rounded-xl bg-slate-100 p-2 text-slate-600 md:hidden dark:bg-slate-800 dark:text-slate-400'
              >
                {isOpen ? (
                  <X className='h-5 w-5' />
                ) : (
                  <Menu className='h-5 w-5' />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='border-t border-slate-200/50 bg-white/95 backdrop-blur-md md:hidden dark:border-slate-800/50 dark:bg-slate-950/95'
            >
              <div className='space-y-2 px-4 py-4'>
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className='h-5 w-5' />
                        <span className='font-medium'>{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Mobile Auth Section */}
                <div className='mt-4 border-t border-slate-200 pt-4 dark:border-slate-800'>
                  {user ? (
                    <>
                      <div className='flex flex-wrap items-center justify-between gap-3 space-x-3 px-4 py-3'>
                        <div className='flex items-center gap-3'>
                          <Image
                            alt=''
                            height={20}
                            width={20}
                            src={session.data?.user.image as string}
                            className='h-10 w-10 rounded-full'
                          />
                          <div>
                            <p className='font-medium text-slate-900 dark:text-slate-100'>
                              {session.data?.user.name}
                            </p>
                            <p className='text-sm text-slate-500 dark:text-slate-400'>
                              {session.data?.user.email}
                            </p>
                          </div>
                        </div>
                        <div className='items-center space-x-3 md:flex'>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className='cursor-pointer items-center space-x-2 rounded-xl bg-slate-100 px-2 py-2 dark:bg-slate-800'
                          >
                            <Link
                              href={`/dashboard`}
                              className='flex gap-1 font-semibold text-gray-500'
                            >
                              <User />
                              <span>Dashboard</span>
                            </Link>
                          </motion.div>
                        </div>
                        <div className='items-center space-x-3 md:flex'>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className='flex cursor-pointer items-center space-x-2 rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800'
                          >
                            <button
                              className='font-semibold text-red-500'
                              onClick={() => signOut()}
                            >
                              Sign out
                            </button>
                          </motion.div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link href='/auth/sign-in' onClick={() => setIsOpen(false)}>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className='flex w-full items-center justify-center space-x-2 rounded-xl bg-emerald-500 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-600'
                      >
                        <LogIn className='h-5 w-5' />
                        <span>Sign In</span>
                      </motion.button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className='h-16' />
    </>
  );
}
