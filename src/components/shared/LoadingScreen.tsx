'use client';

import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    'Preparing ingredients...',
    'Heating the kitchen...',
    'Mixing flavors...',
    'Plating your experience...',
    'Bon appétit!',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 1200);

    return () => clearInterval(stepInterval);
  }, [loadingSteps.length]);

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-amber-50/20 dark:from-slate-950 dark:via-emerald-950/20 dark:to-amber-950/10'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className='absolute h-2 w-2 animate-pulse rounded-full bg-emerald-300/20 dark:bg-emerald-400/20'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Loading Container */}
      <div className='relative z-10 space-y-8 px-6 text-center'>
        {/* Logo Animation */}
        <div className='relative'>
          <div className='relative mx-auto mb-6 h-20 w-20'>
            {/* Outer Ring */}
            <div className='absolute inset-0 animate-spin rounded-full border-4 border-emerald-200 dark:border-emerald-800'>
              <div className='absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 transform rounded-full bg-emerald-500 dark:bg-emerald-400'></div>
            </div>

            {/* Inner Ring */}
            <div
              className='absolute inset-2 animate-spin rounded-full border-4 border-amber-200 dark:border-amber-800'
              style={{ animationDirection: 'reverse', animationDuration: '2s' }}
            >
              <div className='absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1 transform rounded-full bg-amber-500 dark:bg-amber-400'></div>
            </div>

            {/* Center Icon */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='flex h-8 w-8 animate-pulse items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-amber-500 shadow-lg dark:from-emerald-400 dark:to-amber-400'>
                <svg
                  className='h-4 w-4 text-white'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                </svg>
              </div>
            </div>
          </div>

          {/* Brand Name */}
          <h1 className='animate-pulse bg-gradient-to-r from-emerald-600 via-amber-600 to-rose-600 bg-clip-text text-4xl font-bold text-transparent dark:from-emerald-400 dark:via-amber-400 dark:to-rose-400'>
            RecipeSync
          </h1>
          <p className='mt-2 font-medium text-slate-600 dark:text-slate-300'>
            Culinary Excellence Awaits
          </p>
        </div>

        {/* Progress Bar */}
        <div className='mx-auto w-80 max-w-full space-y-4'>
          <div className='h-2 overflow-hidden rounded-full bg-slate-200 backdrop-blur-sm dark:bg-slate-800'>
            <div
              className='relative h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-500 ease-out dark:from-emerald-400 dark:via-amber-400 dark:to-rose-400'
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className='absolute inset-0 animate-pulse bg-white/20'></div>
            </div>
          </div>

          {/* Progress Text */}
          <div className='text-sm font-medium text-slate-600 dark:text-slate-300'>
            {Math.round(Math.min(progress, 100))}% Complete
          </div>
        </div>

        {/* Loading Steps */}
        <div className='space-y-2'>
          <div className='flex min-h-[28px] items-center justify-center text-lg font-medium text-slate-700 dark:text-slate-200'>
            <span className='inline-block animate-pulse'>
              {loadingSteps[currentStep]}
            </span>
          </div>

          {/* Cooking Animation */}
          <div className='mt-4 flex justify-center space-x-2'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='h-2 w-2 animate-bounce rounded-full bg-emerald-500 dark:bg-emerald-400'
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.2s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Subtle Flavor Text */}
        <div className='mt-8 space-y-1 text-xs text-slate-500 dark:text-slate-400'>
          <p>Crafting your perfect culinary experience</p>
          <div className='flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400'>
            <span>•</span>
            <span>Premium Recipes</span>
            <span>•</span>
            <span>Smart Organization</span>
            <span>•</span>
            <span>Beautiful Design</span>
          </div>
        </div>
      </div>

      {/* Glassmorphism Overlay */}
      <div className='absolute inset-0 bg-white/5 backdrop-blur-[1px] dark:bg-black/5'></div>
    </div>
  );
}
