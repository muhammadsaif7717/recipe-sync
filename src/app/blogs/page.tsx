'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Search,
  ChefHat,
  Coffee,
  Utensils,
  Cookie,
} from 'lucide-react';
import Image from 'next/image';

const BlogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedPosts, setLikedPosts] = useState(new Set());

  const categories = [
    { name: 'All', icon: ChefHat, color: 'emerald' },
    { name: 'Quick Meals', icon: Clock, color: 'amber' },
    { name: 'Desserts', icon: Cookie, color: 'rose' },
    { name: 'Beverages', icon: Coffee, color: 'blue' },
    { name: 'Fine Dining', icon: Utensils, color: 'purple' },
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'The Art of Perfect Pasta: From Grain to Plate',
      excerpt:
        'Discover the secrets behind creating restaurant-quality pasta dishes at home, from selecting the right flour to mastering traditional techniques.',
      author: 'Maria Romano',
      authorAvatar: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
      publishDate: '2024-06-20',
      readTime: '8 min read',
      views: 2847,
      likes: 156,
      comments: 24,
      category: 'Fine Dining',
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
      featured: true,
    },
    {
      id: 2,
      title: "15-Minute Breakfast Bowls That'll Change Your Morning",
      excerpt:
        'Transform your hectic mornings with these nutritious, delicious breakfast bowls that take less time than your coffee brew.',
      author: 'Alex Chen',
      authorAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      publishDate: '2024-06-18',
      readTime: '5 min read',
      views: 4291,
      likes: 287,
      comments: 45,
      category: 'Quick Meals',
      image: 'https://images.unsplash.com/photo-1561239781-615abe0878db',
    },
    {
      id: 3,
      title: 'Decadent Chocolate Soufflé: A Journey of Indulgence',
      excerpt:
        'Master the delicate art of soufflé making with this foolproof recipe that guarantees a perfect rise every time.',
      author: 'Sophie Laurent',
      authorAvatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      publishDate: '2024-06-15',
      readTime: '12 min read',
      views: 1876,
      likes: 203,
      comments: 18,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
    },
    {
      id: 4,
      title: 'Artisan Coffee Blends: Creating Your Perfect Cup',
      excerpt:
        'Explore the world of specialty coffee and learn how to create your own signature blends from beans to brewing.',
      author: 'James Rodriguez',
      authorAvatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      publishDate: '2024-06-12',
      readTime: '7 min read',
      views: 3156,
      likes: 198,
      comments: 31,
      category: 'Beverages',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    },
    {
      id: 5,
      title: 'One-Pan Wonders: Minimal Cleanup, Maximum Flavor',
      excerpt:
        'Discover the magic of one-pan cooking with these incredibly flavorful recipes that minimize dishes and maximize taste.',
      author: 'Emma Wilson',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      publishDate: '2024-06-10',
      readTime: '6 min read',
      views: 5203,
      likes: 341,
      comments: 67,
      category: 'Quick Meals',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
    },
    {
      id: 6,
      title: 'Seasonal Herb Gardens: Growing Your Kitchen Pharmacy',
      excerpt:
        'Learn how to cultivate a thriving herb garden that will elevate your cooking and provide fresh ingredients year-round.',
      author: 'David Kim',
      authorAvatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      publishDate: '2024-06-08',
      readTime: '10 min read',
      views: 2934,
      likes: 176,
      comments: 29,
      category: 'All',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b',
    },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.color : 'emerald';
  };

  return (
    <div className='min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950'>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 dark:from-emerald-600 dark:via-emerald-700 dark:to-emerald-800'
      >
        <div className='absolute inset-0 bg-black/20'></div>
        <div className='relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24'>
          <div className='text-center'>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className='mb-6 text-4xl font-bold text-white md:text-6xl'
            >
              Culinary Stories
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className='mx-auto max-w-3xl text-xl leading-relaxed text-emerald-50 md:text-2xl'
            >
              Discover inspiring recipes, cooking techniques, and food stories
              from passionate chefs and home cooks around the world
            </motion.p>
          </div>
        </div>
        <div className='absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
      </motion.section>

      {/* Search and Filter Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className='sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80'
      >
        <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-center justify-between gap-6 lg:flex-row'>
            {/* Search Bar */}
            <div className='relative max-w-md flex-1'>
              <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-slate-400' />
              <input
                type='text'
                placeholder='Search blog posts...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full rounded-xl border border-slate-200 bg-slate-100 py-3 pr-4 pl-10 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800'
              />
            </div>

            {/* Category Filter */}
            <div className='flex flex-wrap gap-2'>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={category.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 font-medium transition-all duration-200 ${
                      selectedCategory === category.name
                        ? `bg-${category.color}-500 text-white shadow-lg`
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className='h-4 w-4' />
                    {category.name}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Blog Posts Grid */}
      <motion.section
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'
      >
        <AnimatePresence mode='wait'>
          <motion.div
            key={selectedCategory + searchTerm}
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'
          >
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/80 ${
                  post.featured ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {/* Image */}
                <div className='relative overflow-hidden'>
                  <Image
                    width={800}
                    height={400}
                    src={post.image}
                    alt={post.title}
                    className='h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>

                  {/* Category Badge */}
                  <div
                    className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold text-white bg-${getCategoryColor(post.category)}-500`}
                  >
                    {post.category}
                  </div>

                  {/* Featured Badge */}
                  {post.featured && (
                    <div className='absolute top-4 right-4 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white'>
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className='p-6'>
                  <h3 className='mb-3 line-clamp-2 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-slate-50 dark:group-hover:text-emerald-400'>
                    {post.title}
                  </h3>

                  <p className='mb-4 line-clamp-3 text-slate-600 dark:text-slate-300'>
                    {post.excerpt}
                  </p>

                  {/* Author Info */}
                  <div className='mb-4 flex items-center gap-3'>
                    <Image
                      width={32}
                      height={32}
                      src={post.authorAvatar}
                      alt={post.author}
                      className='h-8 w-8 rounded-full object-cover'
                    />
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-slate-900 dark:text-slate-50'>
                        {post.author}
                      </p>
                      <div className='flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400'>
                        <span className='flex items-center gap-1'>
                          <Calendar className='h-3 w-3' />
                          {new Date(post.publishDate).toLocaleDateString()}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className='flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700'>
                    <div className='flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400'>
                      <span className='flex items-center gap-1'>
                        <Eye className='h-4 w-4' />
                        {post.views.toLocaleString()}
                      </span>
                      <span className='flex items-center gap-1'>
                        <MessageCircle className='h-4 w-4' />
                        {post.comments}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 rounded-full px-3 py-1 transition-colors duration-200 ${
                        likedPosts.has(post.id)
                          ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                          : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`}
                      />
                      <span className='text-sm font-medium'>
                        {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='py-16 text-center'
          >
            <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800'>
              <Search className='h-12 w-12 text-slate-400' />
            </div>
            <h3 className='mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50'>
              No posts found
            </h3>
            <p className='mx-auto max-w-md text-slate-600 dark:text-slate-300'>
              Try adjusting your search terms or category filter to find the
              culinary content you&apos;re looking for.
            </p>
          </motion.div>
        )}
      </motion.section>

      {/* Newsletter Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className='bg-gradient-to-br from-emerald-50 to-amber-50 py-16 dark:from-slate-900 dark:to-slate-800'
      >
        <div className='mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-4 text-3xl font-bold text-slate-900 md:text-4xl dark:text-slate-50'>
            Never Miss a Recipe
          </h2>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-300'>
            Subscribe to our newsletter and get the latest culinary stories,
            recipes, and cooking tips delivered straight to your inbox.
          </p>
          <div className='mx-auto flex max-w-md flex-col gap-4 sm:flex-row'>
            <input
              type='email'
              placeholder='Enter your email address'
              className='flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900'
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-emerald-600'
            >
              Subscribe
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default BlogsPage;
