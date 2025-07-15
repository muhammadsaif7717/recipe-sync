'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, ChefHat, Star, Heart, Bookmark } from 'lucide-react';
import { Recipe } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getRecipes } from '@/lib/getAPIs';
import Link from 'next/link';
import Image from 'next/image';

// Difficulty color mapping
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-emerald-500 dark:bg-emerald-400';
    case 'medium':
      return 'bg-amber-500 dark:bg-amber-400';
    case 'hard':
      return 'bg-rose-500 dark:bg-rose-400';
    default:
      return 'bg-slate-500 dark:bg-slate-400';
  }
};

// Individual Recipe Card Component
const RecipeCard: React.FC<{ recipe: Recipe; index: number }> = ({
  recipe,
  index,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className='group relative h-full overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-slate-700/50 dark:bg-slate-900/80 dark:shadow-2xl dark:hover:shadow-emerald-500/10'
    >
      {/* Image Section */}
      <div className='relative overflow-hidden'>
        <motion.img
          src={recipe.image}
          alt={recipe.title}
          className='h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-56'
          whileHover={{ scale: 1.05 }}
        />

        {/* Overlay Gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

        {/* Action Buttons */}
        <div className='absolute top-4 right-4 flex gap-2'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className={`rounded-full border border-white/20 p-2 backdrop-blur-md transition-all duration-200 ${
              isLiked
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-slate-700 hover:bg-white dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSaved(!isSaved)}
            className={`rounded-full border border-white/20 p-2 backdrop-blur-md transition-all duration-200 ${
              isSaved
                ? 'bg-emerald-500 text-white'
                : 'bg-white/80 text-slate-700 hover:bg-white dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Difficulty Badge */}
        <div className='absolute top-4 left-4'>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${getDifficultyColor(recipe.difficulty)}`}
          >
            {recipe.difficulty}
          </span>
        </div>

        {/* Cuisine Badge */}
        <div className='absolute bottom-4 left-4'>
          <span className='rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-300'>
            {recipe.cuisine}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className='p-6'>
        {/* Title */}
        <motion.h3
          className='mb-2 line-clamp-2 text-xl font-bold text-slate-900 transition-colors duration-200 group-hover:text-emerald-600 dark:text-slate-50 dark:group-hover:text-emerald-400'
          whileHover={{ scale: 1.02 }}
        >
          {recipe.title}
        </motion.h3>

        {/* Description */}
        <p className='mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
          {recipe.description}
        </p>

        {/* Recipe Stats */}
        <div className='mb-4 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400'>
          <div className='flex items-center gap-1'>
            <Clock className='h-4 w-4 text-emerald-500 dark:text-emerald-400' />
            <span>{recipe.prepTime + recipe.cookTime}m</span>
          </div>
          <div className='flex items-center gap-1'>
            <Users className='h-4 w-4 text-amber-500 dark:text-amber-400' />
            <span>{recipe.servings}</span>
          </div>
          <div className='flex items-center gap-1'>
            <ChefHat className='h-4 w-4 text-rose-500 dark:text-rose-400' />
            <span>{recipe.ingredients.length}</span>
          </div>
        </div>

        {/* Tags */}
        <div className='mb-4 flex flex-wrap gap-2'>
          {recipe.tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className='rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700 transition-colors duration-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            >
              #{tag}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className='px-2 py-1 text-xs text-slate-500 dark:text-slate-400'>
              +{recipe.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Author Section */}
        <div className='flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700'>
          <div className='flex items-center gap-3'>
            <Image
              width={32}
              height={32}
              src={recipe.author.avatar}
              alt={recipe.author.name}
              className='h-8 w-8 rounded-full border-2 border-emerald-500/20'
            />
            <div>
              <p className='text-sm font-medium text-slate-900 dark:text-slate-50'>
                {recipe.author.name}
              </p>
              <div className='flex items-center gap-1'>
                <Star className='h-3 w-3 fill-amber-400 text-amber-400' />
                <span className='text-xs text-slate-500 dark:text-slate-400'>
                  4.8
                </span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors duration-200 hover:bg-emerald-600 hover:shadow-emerald-500/25 dark:bg-emerald-400 dark:hover:bg-emerald-500'
          >
            View Recipe
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Recipe Grid Component
const RecipeCards: React.FC = () => {
  // Use TanStack Query to fetch data
  const {
    data: recipes = [],
    isLoading,
    isError,
  } = useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: () => getRecipes('published'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className='animate-pulse overflow-hidden rounded-2xl bg-white dark:bg-slate-900/80'
        >
          <div className='h-48 bg-slate-200 sm:h-56 dark:bg-slate-700' />
          <div className='p-6'>
            <div className='mb-2 h-6 rounded bg-slate-200 dark:bg-slate-700' />
            <div className='mb-4 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700' />
            <div className='mb-4 flex gap-4'>
              <div className='h-4 w-16 rounded bg-slate-200 dark:bg-slate-700' />
              <div className='h-4 w-16 rounded bg-slate-200 dark:bg-slate-700' />
              <div className='h-4 w-16 rounded bg-slate-200 dark:bg-slate-700' />
            </div>
            <div className='mb-4 flex gap-2'>
              <div className='h-6 w-16 rounded bg-slate-200 dark:bg-slate-700' />
              <div className='h-6 w-20 rounded bg-slate-200 dark:bg-slate-700' />
            </div>
            <div className='flex items-center justify-between pt-4'>
              <div className='flex items-center gap-3'>
                <div className='h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700' />
                <div className='h-4 w-20 rounded bg-slate-200 dark:bg-slate-700' />
              </div>
              <div className='h-8 w-24 rounded bg-slate-200 dark:bg-slate-700' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error State
  const ErrorState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className='py-16 text-center'
    >
      <div className='mx-auto max-w-md rounded-2xl bg-red-100 p-8 dark:bg-red-900/20'>
        <ChefHat className='mx-auto mb-4 h-16 w-16 text-red-400 dark:text-red-500' />
        <h3 className='mb-2 text-xl font-semibold text-red-800 dark:text-red-400'>
          Failed to load recipes
        </h3>
        <p className='mb-4 text-red-600 dark:text-red-300'>
          Something went wrong while fetching recipes. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className='rounded-lg bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600'
        >
          Retry
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className='min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-950'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-12 text-center'
        >
          <h1 className='mb-4 text-4xl font-bold text-slate-900 md:text-5xl dark:text-slate-50'>
            Discover Amazing{' '}
            <span className='bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-500'>
              Recipes
            </span>
          </h1>
          <p className='mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300'>
            Explore our curated collection of delicious recipes from around the
            world. From quick meals to gourmet experiences, find your next
            culinary adventure.
          </p>
        </motion.div>

        {/* Content based on query state */}
        {isLoading && <LoadingSkeleton />}

        {isError && <ErrorState />}

        {!isLoading && !isError && recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          >
            {recipes.map((recipe, index) => (
              <Link href={`/recipe/${recipe._id}`} key={recipe._id || index}>
                <RecipeCard recipe={recipe} index={index} />
              </Link>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && recipes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className='py-16 text-center'
          >
            <ChefHat className='mx-auto mb-4 h-16 w-16 text-slate-400 dark:text-slate-600' />
            <h3 className='mb-2 text-xl font-semibold text-slate-900 dark:text-slate-50'>
              No recipes found
            </h3>
            <p className='text-slate-600 dark:text-slate-400'>
              Check back later for delicious recipes!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecipeCards;
