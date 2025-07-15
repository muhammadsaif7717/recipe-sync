'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat,
  // Search,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Clock,
  Heart,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ReactPlayer from 'react-player/lazy';

const HomepageBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // const [searchQuery, setSearchQuery] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const heroSlides = [
    {
      id: 1,
      title: 'Discover Culinary Magic',
      subtitle: 'From Kitchen to Table',
      description:
        'Explore thousands of handcrafted recipes from world-class chefs and passionate home cooks.',
      backgroundImage:
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
      primaryAction: 'Start Cooking',
      secondaryAction: 'Watch Demo',
      stats: { recipes: '12K+', chefs: '5K+', rating: '4.9' },
    },
    {
      id: 2,
      title: 'Share Your Passion',
      subtitle: 'Join Our Community',
      description:
        'Connect with fellow food enthusiasts and share your favorite recipes with the world.',
      backgroundImage:
        'https://images.unsplash.com/photo-1650012761714-57eae7b7349e',
      primaryAction: 'Join Community',
      secondaryAction: 'View Recipes',
      stats: { recipes: 'New Daily', chefs: 'Global', rating: 'Trending' },
    },
    {
      id: 3,
      title: 'Master Every Dish',
      subtitle: 'Learn & Create',
      description:
        'Step-by-step tutorials and expert tips to elevate your cooking skills to professional levels.',
      backgroundImage:
        'https://images.unsplash.com/photo-1556906781-9a412961c28c',
      primaryAction: 'Learn Now',
      secondaryAction: 'Browse Tips',
      stats: { recipes: 'Expert', chefs: 'Tutorials', rating: 'Pro' },
    },
  ];

  const featuredCategories = [
    {
      name: 'Quick Meals',
      icon: Clock,
      count: '2.4K',
      color: 'amber',
      image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f',
    },
    {
      name: 'Desserts',
      icon: Heart,
      count: '1.8K',
      color: 'rose',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
    },
    {
      name: 'Healthy',
      icon: Sparkles,
      count: '3.2K',
      color: 'emerald',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
    },
    {
      name: 'International',
      icon: Star,
      count: '4.1K',
      color: 'blue',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    },
  ];

  // Deterministic positions for floating elements
  const floatingElements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: (i * 37) % 100, // Deterministic positioning
    top: (i * 23) % 100,
    delay: (i * 0.3) % 2,
    duration: 3 + (i % 3),
  }));

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const slideVariants = {
    enter: { opacity: 0, scale: 1.1 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <div className='relative min-h-screen overflow-hidden bg-slate-950'>
      {/* Background Slideshow */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentSlide}
          variants={slideVariants}
          initial='enter'
          animate='center'
          exit='exit'
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className='absolute inset-0 z-0'
        >
          <div
            className='absolute inset-0 bg-cover bg-center bg-no-repeat'
            style={{
              backgroundImage: `url(${currentSlideData.backgroundImage})`,
            }}
          />
          <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30' />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
        </motion.div>
      </AnimatePresence>

      {/* Floating Elements */}
      {isMounted && (
        <div className='absolute inset-0 z-10'>
          {floatingElements.map((element) => (
            <motion.div
              key={element.id}
              className='absolute h-2 w-2 rounded-full bg-white/20'
              style={{
                left: `${element.left}%`,
                top: `${element.top}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: element.duration,
                repeat: Infinity,
                delay: element.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className='relative z-20 mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='grid min-h-[80vh] items-center gap-12 lg:grid-cols-2'
        >
          {/* Left Column - Text Content */}
          <motion.div variants={itemVariants} className='space-y-8'>
            {/* Subtitle with Animation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className='flex items-center gap-2 text-emerald-400'
            >
              <Sparkles className='h-5 w-5' />
              <span className='text-sm font-semibold tracking-wide uppercase'>
                {currentSlideData.subtitle}
              </span>
            </motion.div>

            {/* Main Title */}
            <AnimatePresence mode='wait'>
              <motion.h1
                key={currentSlide}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className='text-5xl leading-tight font-bold text-white md:text-7xl'
              >
                {currentSlideData.title}
              </motion.h1>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode='wait'>
              <motion.p
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='max-w-lg text-xl leading-relaxed text-slate-300'
              >
                {currentSlideData.description}
              </motion.p>
            </AnimatePresence>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className='flex items-center gap-8'
            >
              <div className='text-center'>
                <div className='text-2xl font-bold text-white'>
                  {currentSlideData.stats.recipes}
                </div>
                <div className='text-sm text-slate-400'>Recipes</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-white'>
                  {currentSlideData.stats.chefs}
                </div>
                <div className='text-sm text-slate-400'>Chefs</div>
              </div>
              <div className='text-center'>
                <div className='flex items-center justify-center gap-1'>
                  <Star className='h-5 w-5 fill-current text-amber-400' />
                  <span className='text-2xl font-bold text-white'>
                    {currentSlideData.stats.rating}
                  </span>
                </div>
                <div className='text-sm text-slate-400'>Rating</div>
              </div>
            </motion.div>

            {/* Search Bar */}
            {/* <motion.div variants={itemVariants} className='relative max-w-md'>
              <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-500 opacity-75 blur'></div>
              <div className='relative rounded-2xl bg-white/10 p-1 backdrop-blur-md'>
                <div className='flex items-center'>
                  <input
                    type='text'
                    placeholder='Search for recipes...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-300 focus:outline-none'
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='rounded-xl bg-emerald-500 p-3 text-white transition-colors duration-200 hover:bg-emerald-600'
                  >
                    <Search className='h-5 w-5' />
                  </motion.button>
                </div>
              </div>
            </motion.div> */}

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className='flex flex-col gap-4 sm:flex-row'
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                className='rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700'
              >
                <Link href={`/recipe`} className='flex items-center gap-3'>
                  <ChefHat className='h-6 w-6' />
                  {currentSlideData.primaryAction}
                  <ArrowRight className='h-5 w-5' />
                </Link>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoPlaying(true)}
                className='flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20'
              >
                <Play className='h-6 w-6' />
                {currentSlideData.secondaryAction}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column - Featured Categories */}
          <motion.div variants={itemVariants} className='space-y-6'>
            <div className='mb-8 text-center'>
              <h3 className='mb-2 text-2xl font-bold text-white'>
                Popular Categories
              </h3>
              <p className='text-slate-300'>
                Discover what&apos;s trending in our community
              </p>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {featuredCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.name}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className='group relative cursor-pointer overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'
                  >
                    <div className='absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-30'>
                      <Image
                        width={300}
                        height={200}
                        src={category.image}
                        alt={category.name}
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className='relative z-10'>
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center bg-${category.color}-500/20 mb-4 rounded-xl`}
                      >
                        <Icon
                          className={`h-6 w-6 text-${category.color}-400`}
                        />
                      </div>
                      <h4 className='mb-1 text-lg font-semibold text-white'>
                        {category.name}
                      </h4>
                      <p className='text-sm text-slate-300'>
                        {category.count} recipes
                      </p>
                    </div>
                    <div className='absolute top-4 right-4'>
                      <TrendingUp className='h-5 w-5 text-white/60' />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Slide Indicators */}
        <motion.div
          variants={itemVariants}
          className='mt-12 flex justify-center gap-3'
        >
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-emerald-500'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </motion.div>
      </div>

      {/* Community Stats Bar */}
      <motion.div
        variants={itemVariants}
        className='absolute right-0 bottom-0 left-0 border-t border-white/10 bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-rose-500/20 backdrop-blur-sm'
      >
        <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between text-white'>
            <div className='flex items-center gap-8'>
              <div className='flex items-center gap-2'>
                <Users className='h-5 w-5 text-emerald-400' />
                <span className='text-sm font-medium'>
                  Join 50K+ Food Lovers
                </span>
              </div>
              <div className='hidden items-center gap-2 sm:flex'>
                <Star className='h-5 w-5 fill-current text-amber-400' />
                <span className='text-sm'>Rated #1 Recipe Platform</span>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className='text-sm font-semibold text-emerald-400'
            >
              🔥 Trending Now
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-white/90 p-4 backdrop-blur-sm dark:bg-black/90'
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className='relative flex aspect-video w-full max-w-4xl items-center justify-center overflow-hidden rounded-2xl bg-slate-900'
              onClick={(e) => e.stopPropagation()}
            >
              {/* React Player container */}
              <div className='relative h-0 w-full pb-[56.25%]'>
                <ReactPlayer
                  url={'https://www.youtube.com/watch?v=9OquUp6x5IU' as string}
                  playing
                  controls
                  width='100%'
                  height='100%'
                  className='absolute top-0 left-0'
                />
              </div>
              <button
                onClick={() => setIsVideoPlaying(false)}
                className='absolute top-9 right-1 flex h-7 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors duration-200 hover:bg-black/70 md:h-10 md:w-10'
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomepageBanner;
