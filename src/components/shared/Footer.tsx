'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChefHat,
  Github,
  Twitter,
  Instagram,
  Facebook,
  Mail,
  MapPin,
  Phone,
  Heart,
  ArrowUp,
  BookOpen,
  Users,
  Utensils,
  Coffee,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

const footerLinks = {
  recipes: [
    { label: 'Browse Recipes', href: '/recipe' },
    { label: 'Add Recipe', href: '/add-recipe' },
    { label: 'Popular Recipes', href: '/recipe?sort=popular' },
    { label: 'Latest Recipes', href: '/recipe?sort=latest' },
  ],
  community: [
    { label: 'Join Community', href: '/community' },
    { label: 'Recipe Contests', href: '/contests' },
    { label: 'Chef Spotlights', href: '/chefs' },
    { label: 'Success Stories', href: '/stories' },
  ],
  resources: [
    { label: 'Cooking Tips', href: '/blogs?category=tips' },
    { label: 'Nutrition Guide', href: '/blogs?category=nutrition' },
    { label: 'Kitchen Tools', href: '/blogs?category=tools' },
    { label: 'Meal Planning', href: '/blogs?category=planning' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Report Issue', href: '/report' },
    { label: 'Feedback', href: '/feedback' },
  ],
};

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
];

const stats = [
  { icon: BookOpen, label: 'Recipes', value: '10K+' },
  { icon: Users, label: 'Chefs', value: '5K+' },
  { icon: Utensils, label: 'Categories', value: '50+' },
  { icon: Coffee, label: 'Daily Active', value: '2K+' },
];

export function Footer() {
  const pathname = usePathname();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/auth')) {
    return null;
  }

  return (
    <footer className='relative border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5 dark:opacity-10'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Stats Section */}
        <div className='border-b border-slate-200 py-12 dark:border-slate-800'>
          <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className='group text-center'
                >
                  <div className='mb-3 flex justify-center'>
                    <div className='rounded-xl bg-emerald-100 p-3 text-emerald-600 transition-transform duration-200 group-hover:scale-110 dark:bg-emerald-900/30 dark:text-emerald-400'>
                      <Icon className='h-6 w-6' />
                    </div>
                  </div>
                  <div className='mb-1 text-2xl font-bold text-slate-900 dark:text-slate-100'>
                    {stat.value}
                  </div>
                  <div className='text-sm text-slate-600 dark:text-slate-400'>
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className='py-12'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6'>
            {/* Brand Section */}
            <div className='lg:col-span-2'>
              <Link href='/' className='mb-4 flex items-center space-x-2'>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className='relative'
                >
                  <ChefHat className='h-8 w-8 text-emerald-500 dark:text-emerald-400' />
                </motion.div>
                <span className='bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-xl font-bold text-transparent dark:from-emerald-400 dark:to-amber-400'>
                  RecipeSync
                </span>
              </Link>

              <p className='mb-6 max-w-sm text-slate-600 dark:text-slate-400'>
                Discover, share, and create amazing recipes with our community
                of passionate home cooks and professional chefs.
              </p>

              {/* Contact Info */}
              <div className='mb-6 space-y-2'>
                <div className='flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400'>
                  <Mail className='h-4 w-4' />
                  <span>hello@recipesync.com</span>
                </div>
                <div className='flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400'>
                  <Phone className='h-4 w-4' />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className='flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400'>
                  <MapPin className='h-4 w-4' />
                  <span>San Francisco, CA</span>
                </div>
              </div>

              {/* Social Links */}
              <div className='flex space-x-3'>
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <Icon className='h-4 w-4' />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className='lg:col-span-1'>
                <h3 className='mb-4 font-semibold text-slate-900 capitalize dark:text-slate-100'>
                  {category}
                </h3>
                <ul className='space-y-2'>
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className='text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400'
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className='border-t border-slate-200 py-8 dark:border-slate-800'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
            <div className='mb-4 md:mb-0'>
              <h3 className='mb-2 font-semibold text-slate-900 dark:text-slate-100'>
                Stay Updated
              </h3>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                Get the latest recipes and cooking tips delivered to your inbox.
              </p>
            </div>

            <div className='flex flex-wrap gap-2 space-x-2'>
              <input
                type='email'
                placeholder='Enter your email'
                className='rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400'
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='rounded-lg bg-emerald-500 px-6 py-2 font-medium text-white transition-colors hover:bg-emerald-600'
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-slate-200 py-6 dark:border-slate-800'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
            <div className='mb-4 flex items-center space-x-4 md:mb-0'>
              <p className='flex items-center text-sm text-slate-600 dark:text-slate-400'>
                Made with
                <Heart className='mx-1 h-4 w-4 animate-pulse text-red-500' />
                by RecipeSync Team
              </p>
            </div>

            <div className='flex items-center space-x-6'>
              <div className='flex space-x-4 text-sm'>
                <Link
                  href='/privacy'
                  className='text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400'
                >
                  Privacy Policy
                </Link>
                <Link
                  href='/terms'
                  className='text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400'
                >
                  Terms of Service
                </Link>
              </div>

              <motion.button
                onClick={scrollToTop}
                className='rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-emerald-100 hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label='Scroll to top'
              >
                <ArrowUp className='h-4 w-4' />
              </motion.button>
            </div>
          </div>

          <div className='mt-4 border-t border-slate-200 pt-4 dark:border-slate-800'>
            <p className='text-center text-sm text-slate-500 dark:text-slate-500'>
              © 2025 RecipeSync. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
