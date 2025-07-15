// /app/auth/sign-in/page.tsx
'use client';

import { FormEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ChefHat,
  Github,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        isSignUp: 'false',
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(provider.toLowerCase(), {
        callbackUrl: callbackUrl,
      });

      if (result?.error) {
        setError('Social login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 dark:bg-slate-950'>
      {/* Background Elements */}
      <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-amber-500/5 to-rose-500/5 dark:from-emerald-400/5 dark:via-amber-400/5 dark:to-rose-400/5' />
      <div className='absolute top-20 -left-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-400/10' />
      <div className='absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl dark:bg-rose-400/10' />
      <div className='absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl dark:bg-amber-400/5' />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='relative z-10 w-full max-w-md'
      >
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className='mb-8'
        >
          <Link
            href='/'
            className='group inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50'
          >
            <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
            <span className='text-sm font-medium'>Back to Home</span>
          </Link>
        </motion.div>

        {/* Sign In Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='rounded-2xl border border-white/20 bg-white/70 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/70 dark:shadow-slate-900/40'
        >
          {/* Header */}
          <div className='mb-8 text-center'>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25 dark:from-emerald-400 dark:to-emerald-500'
            >
              <ChefHat className='h-8 w-8 text-white' />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className='mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50'
            >
              Welcome back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className='text-slate-600 dark:text-slate-300'
            >
              Sign in to your RecipeSync account
            </motion.p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mb-6 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20'
            >
              <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
            </motion.div>
          )}

          {/* Social Login Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className='mb-6 grid grid-cols-2 gap-3'
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className='flex items-center justify-center gap-2 rounded-xl border border-slate-200 p-3 transition-all hover:bg-red-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-red-500/10'
            >
              <svg className='h-5 w-5' viewBox='0 0 24 24'>
                <path
                  fill='#4285F4'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='#34A853'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='#FBBC05'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='#EA4335'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                />
              </svg>
              <span className='text-sm font-medium'>Google</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSocialLogin('GitHub')}
              disabled={isLoading}
              className='flex items-center justify-center gap-2 rounded-xl border border-slate-200 p-3 transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800'
            >
              <Github className='h-5 w-5 text-slate-600 dark:text-slate-300' />
              <span className='text-sm font-medium text-slate-600 dark:text-slate-300'>
                GitHub
              </span>
            </motion.button>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className='relative mb-6'
          >
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-slate-200 dark:border-slate-700' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white/70 px-4 text-slate-600 dark:bg-slate-900/70 dark:text-slate-300'>
                or sign in with email
              </span>
            </div>
          </motion.div>

          {/* Sign In Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            onSubmit={handleSubmit}
            className='space-y-6'
          >
            {/* Email Field */}
            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Email address
              </label>
              <div className='relative'>
                <Mail className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500' />
                <input
                  type='email'
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className='w-full rounded-xl border border-slate-200 bg-white/50 py-3 pr-4 pl-10 text-slate-900 placeholder-slate-400 transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:ring-emerald-400'
                  placeholder='john@example.com'
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className='w-full rounded-xl border border-slate-200 bg-white/50 py-3 pr-12 pl-10 text-slate-900 placeholder-slate-400 transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:ring-emerald-400'
                  placeholder='Enter your password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({ ...formData, rememberMe: e.target.checked })
                  }
                  className='h-4 w-4 rounded border-slate-300 bg-white text-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-emerald-400 dark:focus:ring-emerald-400'
                />
                <label className='ml-2 text-sm text-slate-600 dark:text-slate-300'>
                  Remember me
                </label>
              </div>
              <Link
                href='/auth/forgot-password'
                className='text-sm text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={isLoading}
              className='w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 font-medium text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:from-emerald-400 dark:to-emerald-500 dark:focus:ring-emerald-400 dark:focus:ring-offset-slate-900'
            >
              <AnimatePresence mode='wait'>
                {isLoading ? (
                  <motion.div
                    key='loading'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='flex items-center justify-center'
                  >
                    <div className='mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
                    Signing in...
                  </motion.div>
                ) : (
                  <motion.span
                    key='text'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className='mt-6 text-center'
          >
            <p className='text-slate-600 dark:text-slate-300'>
              Don{`'`}t have an account?{' '}
              <Link
                href='/auth/sign-up'
                className='font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
              >
                Sign up here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
