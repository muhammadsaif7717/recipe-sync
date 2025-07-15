'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Users,
  ChefHat,
  Globe,
  Star,
  Heart,
  Share2,
  Bookmark,
  Play,
  CheckCircle2,
  Timer,
  User,
} from 'lucide-react';
import { Recipe } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import { getRecipeById } from '@/lib/getAPIs';

const RecipeDetails = ({ id }: { id: string }) => {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  // TanStack Query
  const { data, isLoading, isError, error } = useQuery<Recipe>({
    queryKey: ['recipe'],
    queryFn: () => getRecipeById(id),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className='mx-auto max-w-7xl space-y-6 p-8'>
        {/* Hero Image Skeleton */}
        <Skeleton className='h-96 w-full rounded-3xl' />

        {/* Title Skeleton */}
        <Skeleton className='h-12 w-3/4 rounded-lg' />

        {/* Description Skeleton */}
        <Skeleton className='h-6 w-full rounded-lg' />
        <Skeleton className='h-6 w-full rounded-lg' />
        <Skeleton className='h-6 w-2/3 rounded-lg' />

        {/* Stats Skeleton */}
        <div className='flex gap-4'>
          <Skeleton className='h-8 w-24 rounded-full' />
          <Skeleton className='h-8 w-24 rounded-full' />
          <Skeleton className='h-8 w-24 rounded-full' />
        </div>

        {/* Ingredients and Steps Skeleton */}
        <Skeleton className='h-48 w-full rounded-2xl' />
        <Skeleton className='h-96 w-full rounded-2xl' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex h-screen items-center justify-center text-rose-600'>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (!data) {
    return (
      <div className='flex h-screen items-center justify-center text-slate-700 dark:text-slate-200'>
        Recipe not found
      </div>
    );
  }

  const toggleStepComplete = (stepId: string) => {
    const updated = new Set(completedSteps);
    if (updated.has(stepId)) {
      updated.delete(stepId);
    } else {
      updated.add(stepId);
    }
    setCompletedSteps(updated);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'Hard':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className='min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950'>
      <motion.div
        className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        {/* Hero Section */}
        <motion.div
          className='relative mb-12 overflow-hidden rounded-3xl shadow-2xl'
          variants={itemVariants}
        >
          <div className='relative h-96 lg:h-[500px]'>
            <Image
              width={1200}
              height={500}
              src={data.image}
              alt={data.title}
              className='h-full w-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

            {/* Buttons */}
            <div className='absolute top-6 right-6 flex gap-3'>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLiked(!isLiked)}
                className={`rounded-full p-3 backdrop-blur-lg transition-colors ${
                  isLiked
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`rounded-full p-3 backdrop-blur-lg transition-colors ${
                  isBookmarked
                    ? 'bg-amber-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Bookmark
                  className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className='rounded-full bg-white/20 p-3 text-white backdrop-blur-lg hover:bg-white/30'
              >
                <Share2 className='h-5 w-5' />
              </motion.button>
            </div>

            {/* Title */}
            <div className='absolute right-0 bottom-0 left-0 p-8'>
              <motion.h1
                className='mb-4 text-4xl font-bold text-white lg:text-5xl'
                variants={itemVariants}
              >
                {data.title}
              </motion.h1>
              <motion.p
                className='mb-6 max-w-2xl text-lg text-white/90'
                variants={itemVariants}
              >
                {data.description}
              </motion.p>
              <motion.div
                className='flex flex-wrap gap-4'
                variants={itemVariants}
              >
                <div className='flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-lg'>
                  <Clock className='h-5 w-5 text-white' />
                  <span className='font-medium text-white'>
                    {data.prepTime + data.cookTime} min total
                  </span>
                </div>
                <div className='flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-lg'>
                  <Users className='h-5 w-5 text-white' />
                  <span className='font-medium text-white'>
                    {data.servings} servings
                  </span>
                </div>
                <div className='flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-lg'>
                  <ChefHat className='h-5 w-5 text-white' />
                  <span className='font-medium text-white'>
                    {data.difficulty}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main + Sidebar */}
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main content */}
          <div className='space-y-8 lg:col-span-2'>
            {/* Recipe stats */}
            <motion.div
              className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'
              variants={itemVariants}
            >
              <StatCard
                icon={
                  <Timer className='text-emerald-600 dark:text-emerald-400' />
                }
                label='Prep Time'
                value={`${data.prepTime}m`}
              />
              <StatCard
                icon={<Clock className='text-amber-600 dark:text-amber-400' />}
                label='Cook Time'
                value={`${data.cookTime}m`}
              />
              <StatCard
                icon={<Users className='text-rose-600 dark:text-rose-400' />}
                label='Servings'
                value={`${data.servings}`}
              />
              <StatCard
                icon={<Globe className='text-blue-600 dark:text-blue-400' />}
                label='Cuisine'
                value={data.cuisine}
              />
            </motion.div>

            {/* Tags */}
            <motion.div
              className='rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900/80'
              variants={itemVariants}
            >
              <div className='flex flex-wrap gap-4'>
                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium ${getDifficultyColor(data.difficulty)}`}
                >
                  {data.difficulty} Level
                </span>
                {data.tags.map((tag, i) => (
                  <motion.span
                    key={i}
                    className='rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    whileHover={{ scale: 1.05 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              className='rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-900/80'
              variants={itemVariants}
            >
              <div className='mb-6 flex items-center gap-3'>
                <Play className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
                <h2 className='text-2xl font-bold'>Cooking Instructions</h2>
              </div>
              <div className='space-y-4'>
                {data.steps.map((step, i) => (
                  <motion.div
                    key={step.id}
                    className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${
                      completedSteps.has(step.id)
                        ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20'
                        : activeStep === step.id
                          ? 'border-amber-200 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20'
                          : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'
                    }`}
                    onClick={() =>
                      setActiveStep(activeStep === step.id ? null : step.id)
                    }
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className='flex items-start gap-4'>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStepComplete(step.id);
                        }}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                          completedSteps.has(step.id)
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {completedSteps.has(step.id) ? <CheckCircle2 /> : i + 1}
                      </motion.button>
                      <div className='flex-1'>
                        <div className='mb-2 flex justify-between'>
                          <h3 className='font-semibold'>Step {i + 1}</h3>
                          <div className='flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400'>
                            <Timer className='h-4 w-4' />
                            {step.duration} min
                          </div>
                        </div>
                        <p
                          className={`leading-relaxed ${completedSteps.has(step.id) ? 'line-through opacity-75' : ''}`}
                        >
                          {step.instruction}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            <SidebarAuthor author={data.author} />
            <SidebarIngredients ingredients={data.ingredients} />
            <SidebarRating />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// StatCard reusable
const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className='rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900/80'>
    <div className='mb-2 flex gap-3'>
      {icon}
      <span className='text-sm font-medium'>{label}</span>
    </div>
    <p className='text-xl font-bold'>{value}</p>
  </div>
);

// Sidebar Author
const SidebarAuthor = ({ author }: { author: Recipe['author'] }) => (
  <div className='rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900/80'>
    <div className='mb-4 flex items-center gap-3'>
      <User className='h-5 w-5' />
      <h3 className='font-semibold'>Recipe by</h3>
    </div>
    <div className='flex items-center gap-3'>
      <Image
        width={48}
        height={48}
        src={author.avatar}
        alt={author.name}
        className='h-12 w-12 rounded-full'
      />
      <div>
        <p className='font-semibold'>{author.name}</p>
        <p className='text-sm'>{author.email}</p>
      </div>
    </div>
  </div>
);

// Sidebar Ingredients
const SidebarIngredients = ({
  ingredients,
}: {
  ingredients: Recipe['ingredients'];
}) => (
  <div className='rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900/80'>
    <div className='mb-4 flex gap-3'>
      <ChefHat className='h-5 w-5' />
      <h3 className='font-semibold'>Ingredients</h3>
    </div>
    {ingredients.map((ing) => (
      <div
        key={ing.id}
        className='flex justify-between border-b py-2 last:border-0'
      >
        <span>{ing.name}</span>
        <span className='text-sm'>
          {ing.amount} {ing.unit}
        </span>
      </div>
    ))}
  </div>
);

// Sidebar Rating
const SidebarRating = () => (
  <div className='rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900/80'>
    <div className='mb-4 flex gap-3'>
      <Star className='h-5 w-5' />
      <h3 className='font-semibold'>Rating</h3>
    </div>
    <div className='mb-2 flex items-center gap-2'>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={i <= 4 ? 'fill-current text-amber-400' : 'text-slate-400'}
        />
      ))}
      <span className='font-semibold'>4.8</span>
    </div>
    <p className='text-sm text-slate-600'>Based on 156 reviews</p>
  </div>
);

export default RecipeDetails;
