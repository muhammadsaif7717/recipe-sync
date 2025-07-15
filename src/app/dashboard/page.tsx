'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  ChefHat,
  BookOpen,
  Heart,
  Users,
  TrendingUp,
  Settings,
  Plus,
  Eye,
  Clock,
  Award,
  AlertCircle,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ActionButtonProps, StatCardProps } from '@/types';

// Mock data
const mockUserStats = {
  recipesCreated: 12,
  favoritesCount: 45,
  followersCount: 23,
  totalViews: 1240,
};

const mockAdminStats = {
  totalUsers: 1250,
  totalRecipes: 3400,
  totalViews: 125000,
  pendingReviews: 8,
};

const Dashboard = () => {
  const session = useSession();

  if (session.status === 'loading') {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950'>
        <div className='space-y-4 text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-500'></div>
          <p className='text-slate-600 dark:text-slate-300'>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!session.data) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950'>
        <div className='space-y-4 text-center'>
          <AlertCircle className='mx-auto h-16 w-16 text-rose-500' />
          <h2 className='text-xl font-semibold text-slate-900 dark:text-slate-50'>
            Access Denied
          </h2>
          <p className='text-slate-600 dark:text-slate-300'>
            Please sign in to access your dashboard
          </p>
        </div>
      </div>
    );
  }

  const isAdmin = session.data?.user?.role === 'admin';

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'
        >
          {isAdmin ? (
            <>
              <StatCard
                Icon={Users}
                label='Total Users'
                value={mockAdminStats.totalUsers}
                color='emerald'
              />
              <StatCard
                Icon={BookOpen}
                label='Total Recipes'
                value={mockAdminStats.totalRecipes}
                color='amber'
              />
              <StatCard
                Icon={Eye}
                label='Total Views'
                value={mockAdminStats.totalViews}
                color='rose'
              />
              <StatCard
                Icon={Clock}
                label='Pending Reviews'
                value={mockAdminStats.pendingReviews}
                color='blue'
              />
            </>
          ) : (
            <>
              <StatCard
                Icon={ChefHat}
                label='Recipes Created'
                value={mockUserStats.recipesCreated}
                color='emerald'
              />
              <StatCard
                Icon={Heart}
                label='Favorites'
                value={mockUserStats.favoritesCount}
                color='rose'
              />
              <StatCard
                Icon={Users}
                label='Followers'
                value={mockUserStats.followersCount}
                color='amber'
              />
              <StatCard
                Icon={Eye}
                label='Total Views'
                value={mockUserStats.totalViews}
                color='blue'
              />
            </>
          )}
        </motion.div>

        {/* Main Content */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Left Column - Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className='space-y-6'
          >
            {/* Quick Actions */}
            <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80'>
              <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50'>
                Quick Actions
              </h3>
              <div className='space-y-3'>
                {isAdmin ? (
                  <>
                    <ActionButton
                      Icon={Users}
                      label='Manage Users'
                      href='/dashboard/admin/users'
                    />
                    <ActionButton
                      Icon={BookOpen}
                      label='Review Recipes'
                      href='/dashboard/admin/pending'
                    />
                    <ActionButton
                      Icon={Settings}
                      label='Site Settings'
                      href='/dashboard/admin/settings'
                    />
                  </>
                ) : (
                  <>
                    <ActionButton
                      Icon={Plus}
                      label='Create Recipe'
                      href='/add-recipe'
                    />
                    <ActionButton
                      Icon={Heart}
                      label='My Favorites'
                      href='/favorites'
                    />
                    <ActionButton
                      Icon={TrendingUp}
                      label='My Stats'
                      href='/stats'
                    />
                    <ActionButton
                      Icon={Settings}
                      label='Account Settings'
                      href='/settings'
                    />
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className='lg:col-span-2'
          >
            <div className='rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white'>
              <div className='flex items-center space-x-3'>
                <Award className='h-8 w-8' />
                <div>
                  <h3 className='font-semibold'>
                    {isAdmin ? 'Admin Excellence' : 'Recipe Master'}
                  </h3>
                  <p className='text-sm text-emerald-100'>
                    {isAdmin
                      ? 'Managing the community'
                      : 'Keep sharing great recipes!'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ Icon, label, value, color }: StatCardProps) => {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-500 text-white',
    amber: 'bg-amber-500 text-white',
    rose: 'bg-rose-500 text-white',
    blue: 'bg-blue-500 text-white',
  };

  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-slate-600 dark:text-slate-300'>{label}</p>
          <p className='text-2xl font-bold text-slate-900 dark:text-slate-50'>
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`rounded-full p-3 ${colorClasses[color]}`}>
          <Icon className='h-6 w-6' />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ Icon, label, href }: ActionButtonProps) => {
  return (
    <Link href={href}>
      <button className='flex w-full items-center space-x-3 rounded-lg p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50'>
        <Icon className='h-5 w-5 text-slate-600 dark:text-slate-300' />
        <span className='text-slate-700 dark:text-slate-200'>{label}</span>
      </button>
    </Link>
  );
};

export default Dashboard;
