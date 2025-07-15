'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Clock,
  ChefHat,
  Users,
  XCircle,
  Eye,
  MoreVertical,
  Search,
  Check,
  X,
  Filter,
  SortAsc,
  Calendar,
  Star,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Recipe } from '@/types';
import { getRecipes } from '@/lib/getAPIs';

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

// Difficulty color mapping
const difficultyColors = {
  Easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Medium:
    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Hard: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800',
};

export default function PendingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [lastUpdated, setLastUpdated] = useState('');

  const {
    data: recipes = [],
    isLoading,
    isError,
  } = useQuery<Recipe[]>({
    queryKey: ['recipes', 'pending'],
    queryFn: () => getRecipes('pending'),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const formattedDate = new Date().toLocaleDateString();
    setLastUpdated(formattedDate);
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine =
      !selectedCuisine ||
      selectedCuisine === 'all' ||
      recipe.cuisine === selectedCuisine;
    const matchesDifficulty =
      !selectedDifficulty ||
      selectedDifficulty === 'all' ||
      recipe.difficulty === selectedDifficulty;
    return matchesSearch && matchesCuisine && matchesDifficulty;
  });

  const uniqueCuisines = [...new Set(recipes.map((r) => r.cuisine))];

  const handleApprove = (recipeId: string) => {
    // Add approval logic here
    console.log('Approving recipe:', recipeId);
  };

  const handleDecline = (recipeId: string) => {
    // Add decline logic here
    console.log('Declining recipe:', recipeId);
  };

  if (isError) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 dark:from-slate-950 dark:to-slate-900'>
        <div className='mx-auto max-w-7xl'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className='border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 shadow-xl dark:border-rose-800 dark:from-rose-950/20 dark:to-pink-950/20'>
              <CardContent className='p-6 sm:p-8'>
                <div className='flex flex-col items-center space-y-3 text-rose-600 sm:flex-row sm:space-y-0 sm:space-x-4 dark:text-rose-400'>
                  <div className='rounded-full bg-rose-100 p-3 dark:bg-rose-900/30'>
                    <XCircle className='h-6 w-6' />
                  </div>
                  <div className='text-center sm:text-left'>
                    <h3 className='mb-1 text-lg font-semibold'>
                      Unable to Load Recipes
                    </h3>
                    <p className='text-sm opacity-90'>
                      Failed to load pending recipes. Please try again.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-4 sm:p-6 dark:from-slate-950 dark:via-blue-950/10 dark:to-slate-900'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial='hidden'
          animate='visible'
          className='mb-8 sm:mb-12'
        >
          <div className='text-center sm:text-left'>
            <h1 className='mb-3 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-3xl font-bold text-transparent sm:mb-4 sm:text-4xl lg:text-5xl dark:from-slate-50 dark:to-slate-300'>
              Pending Recipes
            </h1>
            <p className='max-w-2xl text-sm text-slate-600 sm:text-base lg:text-lg dark:text-slate-300'>
              Review and manage recipes awaiting approval with enhanced controls
            </p>
          </div>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='mb-6 sm:mb-8'
        >
          <Card className='border-0 bg-white/90 shadow-2xl ring-1 ring-slate-200/50 backdrop-blur-md dark:bg-slate-900/90 dark:ring-slate-800/50'>
            <CardContent className='p-4 sm:p-6'>
              <div className='flex flex-col space-y-4'>
                {/* Search and Sort Row */}
                <div className='flex flex-col gap-3 sm:flex-row sm:gap-4'>
                  <div className='relative flex-1'>
                    <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400' />
                    <Input
                      placeholder='Search recipes, descriptions...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='h-11 border-slate-200 bg-slate-50 pl-10 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/50'
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className='h-11 w-full bg-slate-50 sm:w-[160px] dark:bg-slate-800/50'>
                      <SortAsc className='mr-2 h-4 w-4' />
                      <SelectValue placeholder='Sort by' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='newest'>Newest First</SelectItem>
                      <SelectItem value='oldest'>Oldest First</SelectItem>
                      <SelectItem value='title'>Title A-Z</SelectItem>
                      <SelectItem value='difficulty'>Difficulty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter Row */}
                <div className='flex flex-col gap-3 sm:flex-row sm:gap-4'>
                  <div className='flex flex-1 items-center gap-2 sm:gap-3'>
                    <Filter className='hidden h-4 w-4 text-slate-500 sm:block' />
                    <Select
                      value={selectedCuisine}
                      onValueChange={setSelectedCuisine}
                    >
                      <SelectTrigger className='h-10 flex-1 bg-slate-50 dark:bg-slate-800/50'>
                        <SelectValue placeholder='All Cuisines' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Cuisines</SelectItem>
                        {uniqueCuisines.map((cuisine) => (
                          <SelectItem key={cuisine} value={cuisine}>
                            {cuisine}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedDifficulty}
                      onValueChange={setSelectedDifficulty}
                    >
                      <SelectTrigger className='h-10 flex-1 bg-slate-50 dark:bg-slate-800/50'>
                        <SelectValue placeholder='All Difficulties' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Difficulties</SelectItem>
                        <SelectItem value='Easy'>Easy</SelectItem>
                        <SelectItem value='Medium'>Medium</SelectItem>
                        <SelectItem value='Hard'>Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Count and Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='mb-6 sm:mb-8'
        >
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
            <p className='text-sm text-slate-600 sm:text-base dark:text-slate-300'>
              Showing{' '}
              <span className='font-semibold text-slate-900 dark:text-slate-100'>
                {filteredRecipes.length}
              </span>{' '}
              of{' '}
              <span className='font-semibold text-slate-900 dark:text-slate-100'>
                {recipes.length}
              </span>{' '}
              pending recipes
            </p>
            <div className='flex items-center gap-2 text-xs text-slate-500 sm:text-sm dark:text-slate-400'>
              <Calendar className='h-4 w-4' />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4'>
            {[...Array(8)].map((_, i) => (
              <Card
                key={i}
                className='border-0 bg-white/90 shadow-lg backdrop-blur-sm dark:bg-slate-900/90'
              >
                <CardContent className='p-4 sm:p-6'>
                  <Skeleton className='mb-4 h-40 w-full rounded-lg sm:h-48' />
                  <Skeleton className='mb-2 h-6 w-3/4' />
                  <Skeleton className='mb-4 h-4 w-full' />
                  <div className='mb-4 flex gap-2'>
                    <Skeleton className='h-6 w-16' />
                    <Skeleton className='h-6 w-20' />
                  </div>
                  <div className='flex gap-2'>
                    <Skeleton className='h-9 flex-1' />
                    <Skeleton className='h-9 flex-1' />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Display Recipes */}
        <AnimatePresence mode='wait'>
          {!isLoading && (
            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4'
            >
              {filteredRecipes.length === 0 ? (
                <motion.div variants={itemVariants} className='col-span-full'>
                  <Card className='border-0 bg-white/90 shadow-xl backdrop-blur-sm dark:bg-slate-900/90'>
                    <CardContent className='p-8 text-center sm:p-12'>
                      <div className='mx-auto mb-4 w-fit rounded-full bg-slate-100 p-4 dark:bg-slate-800'>
                        <ChefHat className='h-12 w-12 text-slate-400 sm:h-16 sm:w-16' />
                      </div>
                      <h3 className='mb-2 text-xl font-semibold text-slate-600 sm:text-2xl dark:text-slate-300'>
                        No pending recipes found
                      </h3>
                      <p className='mx-auto max-w-md text-sm text-slate-500 sm:text-base dark:text-slate-400'>
                        {searchTerm || selectedCuisine || selectedDifficulty
                          ? 'Try adjusting your search or filters to find more recipes'
                          : 'All recipes have been reviewed and processed'}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                filteredRecipes.map((recipe) => (
                  <motion.div
                    key={recipe._id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className='group flex h-full flex-col overflow-hidden border-0 bg-white/90 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:bg-slate-900/90'>
                      <div className='relative overflow-hidden'>
                        <Image
                          height={300}
                          width={300}
                          src={recipe.image}
                          alt={recipe.title}
                          className='h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-48'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                        <div className='absolute top-3 right-3 left-3 flex items-start justify-between'>
                          <Badge className='border-0 bg-amber-500/90 text-white shadow-lg hover:bg-amber-500'>
                            Pending Review
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 bg-black/20 p-0 text-white backdrop-blur-sm hover:bg-black/40'
                              >
                                <MoreVertical className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-48'>
                              <DropdownMenuItem>
                                <Eye className='mr-2 h-4 w-4' />
                                View Full Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Star className='mr-2 h-4 w-4' />
                                Add to Favorites
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <CardContent className='flex flex-1 flex-col p-4 sm:p-6'>
                        <div className='flex-1'>
                          <h3 className='mb-2 line-clamp-1 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600 sm:text-xl dark:text-slate-50 dark:group-hover:text-blue-400'>
                            {recipe.title}
                          </h3>
                          <p className='mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
                            {recipe.description}
                          </p>

                          <div className='mb-4 flex flex-wrap gap-2'>
                            <Badge
                              variant='outline'
                              className={difficultyColors[recipe.difficulty]}
                            >
                              {recipe.difficulty}
                            </Badge>
                            <Badge
                              variant='outline'
                              className='bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            >
                              {recipe.cuisine}
                            </Badge>
                          </div>

                          <div className='mb-4 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400'>
                            <div className='flex items-center gap-1'>
                              <Clock className='h-4 w-4' />
                              <span>{recipe.prepTime + recipe.cookTime}m</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Users className='h-4 w-4' />
                              <span>{recipe.servings} servings</span>
                            </div>
                          </div>

                          <div className='mb-4 flex items-center gap-2'>
                            <Image
                              src={recipe.author.avatar}
                              height={20}
                              width={20}
                              alt=''
                              className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white shadow-lg'
                            />

                            <div className='min-w-0 flex-1'>
                              <p className='truncate text-sm font-medium text-slate-900 dark:text-slate-50'>
                                {recipe.author.name}
                              </p>
                              <p className='text-xs text-slate-500 dark:text-slate-400'>
                                Recipe Author
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='mt-auto flex gap-2'>
                          <Button
                            onClick={() => handleApprove(recipe._id as string)}
                            className='h-10 flex-1 border-0 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg transition-all duration-200 hover:from-emerald-600 hover:to-green-700 hover:shadow-xl'
                          >
                            <Check className='mr-2 h-4 w-4' />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleDecline(recipe._id as string)}
                            variant='outline'
                            className='h-10 flex-1 border-rose-200 text-rose-600 transition-all duration-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/20 dark:hover:text-rose-300'
                          >
                            <X className='mr-2 h-4 w-4' />
                            Decline
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
