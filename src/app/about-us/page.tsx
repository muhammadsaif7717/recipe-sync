'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ChefHat,
  Users,
  Heart,
  Globe,
  Star,
  Utensils,
  BookOpen,
  Award,
} from 'lucide-react';
import Image from 'next/image';

const AboutPage = () => {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Cooks' },
    { icon: BookOpen, value: '25K+', label: 'Recipes Shared' },
    { icon: Globe, value: '120+', label: 'Countries' },
    { icon: Award, value: '4.9/5', label: 'User Rating' },
  ];

  const team = [
    {
      name: 'Muhammad Saif',
      role: 'Founder & Tech Lead',
      bio: 'Full-stack developer passionate about food technology.',
      image: 'https://i.ibb.co/JR145fVk/saif.png',
    },
    {
      name: 'Fuade Hasan Alamin',
      role: 'Community Manager',
      bio: 'Food blogger connecting cultures through cuisine',
      image: 'https://i.ibb.co/G4gSwBr6/IMG20230806161044-1.jpg',
    },
    {
      name: 'Toimom Hasan',
      role: 'Community Manager',
      bio: 'Food blogger connecting cultures through cuisine',
      image:
        'https://i.ibb.co/G4qvLKpw/459182227-122098767392523158-7832339037180935556-n.jpg',
    },
    {
      name: 'Ahmed Omor',
      role: 'Community Manager',
      bio: 'Food blogger connecting cultures through cuisine',
      image:
        'https://i.ibb.co/BKNvyrDw/493262136-670193989302445-3062080732779733389-n.jpg',
    },
    {
      name: 'Mahmudun Nabin Ejaj',
      role: 'Community Manager',
      bio: 'Food blogger connecting cultures through cuisine',
      image:
        'https://i.ibb.co/8gDDm4w0/469928575-636824425763636-5033176549494991802-n.jpg',
    },
    {
      name: 'Polok Ahmed Himel',
      role: 'Community Manager',
      bio: 'Food blogger connecting cultures through cuisine',
      image:
        'https://i.ibb.co/DfgT2msH/438222507-948731066912587-3048292677563635771-n.jpg',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion for Food',
      description:
        'We believe cooking is an art form that brings people together and creates lasting memories.',
    },
    {
      icon: Users,
      title: 'Community First',
      description:
        'Our platform thrives on the shared knowledge and creativity of home cooks worldwide.',
    },
    {
      icon: Globe,
      title: 'Cultural Exchange',
      description:
        'We celebrate diverse culinary traditions and promote cross-cultural understanding through food.',
    },
    {
      icon: Star,
      title: 'Quality Content',
      description:
        'Every recipe is carefully curated to ensure authenticity, clarity, and delicious results.',
    },
  ];

  return (
    <div className='min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950'>
      {/* Hero Section */}
      <motion.section
        className='relative overflow-hidden py-20 lg:py-32'
        initial='hidden'
        animate='visible'
        variants={containerVariants}
      >
        <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10 dark:from-emerald-400/10 dark:to-amber-400/10' />
        <div className='relative z-10 container mx-auto px-4'>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.div
              variants={itemVariants}
              className='mb-8 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-6 py-3 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80'
            >
              <ChefHat className='h-6 w-6 text-emerald-500 dark:text-emerald-400' />
              <span className='font-medium text-slate-700 dark:text-slate-300'>
                About RecipeSync
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className='mb-6 text-4xl leading-tight font-bold text-slate-900 md:text-6xl lg:text-7xl dark:text-slate-50'
            >
              Connecting Kitchens
              <span className='block bg-gradient-to-r from-emerald-500 to-amber-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-amber-400'>
                Around the World
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className='mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-slate-600 md:text-2xl dark:text-slate-300'
            >
              We are building more than a recipe platform – we are creating a
              global community where culinary traditions meet modern innovation.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className='mx-auto grid max-w-2xl grid-cols-2 gap-8 md:grid-cols-4'
            >
              {stats.map((stat, index) => (
                <div key={index} className='text-center'>
                  <div className='mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 dark:from-emerald-400 dark:to-amber-400'>
                    <stat.icon className='h-6 w-6 text-white' />
                  </div>
                  <div className='text-2xl font-bold text-slate-900 dark:text-slate-50'>
                    {stat.value}
                  </div>
                  <div className='text-sm text-slate-600 dark:text-slate-400'>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section
        className='bg-white py-20 transition-colors duration-300 dark:bg-slate-900/50'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className='container mx-auto px-4'>
          <div className='mx-auto max-w-4xl'>
            <motion.div variants={itemVariants} className='mb-16 text-center'>
              <h2 className='mb-6 text-3xl font-bold text-slate-900 md:text-4xl dark:text-slate-50'>
                Our Story
              </h2>
              <div className='mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 dark:from-emerald-400 dark:to-amber-400' />
            </motion.div>

            <div className='grid items-center gap-12 md:grid-cols-2'>
              <motion.div variants={itemVariants}>
                <div className='relative overflow-hidden rounded-2xl shadow-2xl'>
                  <Image
                    width={600}
                    height={400}
                    src='https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop'
                    alt='Cooking together'
                    className='h-80 w-full object-cover'
                    loading='lazy'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent' />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className='space-y-6'>
                <p className='text-lg leading-relaxed text-slate-600 dark:text-slate-300'>
                  RecipeSync was born from a simple observation the best recipes
                  are often passed down through generations, shared between
                  friends, and discovered in the most unexpected places.
                </p>
                <p className='text-lg leading-relaxed text-slate-600 dark:text-slate-300'>
                  We wanted to create a digital space that honors these
                  traditions while embracing modern technology. A place where
                  your grandmother{`'`}s secret sauce recipe can sit alongside
                  innovative fusion dishes from around the world.
                </p>
                <p className='text-lg leading-relaxed text-slate-600 dark:text-slate-300'>
                  Today, RecipeSync is home to thousands of passionate cooks who
                  share not just recipes, but stories, techniques, and the joy
                  of creating something delicious.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        className='bg-slate-50 py-20 transition-colors duration-300 dark:bg-slate-950'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className='container mx-auto px-4'>
          <motion.div variants={itemVariants} className='mb-16 text-center'>
            <h2 className='mb-6 text-3xl font-bold text-slate-900 md:text-4xl dark:text-slate-50'>
              What We Believe In
            </h2>
            <div className='mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 dark:from-rose-400 dark:to-amber-400' />
          </motion.div>

          <div className='mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='group rounded-2xl border border-slate-200 bg-white p-8 backdrop-blur-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-emerald-700'
              >
                <div className='mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 transition-transform duration-300 group-hover:scale-110 dark:from-emerald-400 dark:to-amber-400'>
                  <value.icon className='h-8 w-8 text-white' />
                </div>
                <h3 className='mb-4 text-xl font-bold text-slate-900 dark:text-slate-50'>
                  {value.title}
                </h3>
                <p className='leading-relaxed text-slate-600 dark:text-slate-300'>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className='bg-white py-20 transition-colors duration-300 dark:bg-slate-900/50'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className='container mx-auto px-4'>
          <motion.div variants={itemVariants} className='mb-16 text-center'>
            <h2 className='mb-6 text-3xl font-bold text-slate-900 md:text-4xl dark:text-slate-50'>
              Meet Our Team
            </h2>
            <div className='mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 to-rose-500 dark:from-emerald-400 dark:to-rose-400' />
          </motion.div>

          <div className='mx-auto grid max-w-4xl gap-8 md:grid-cols-3'>
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='group rounded-2xl border border-slate-200 bg-white p-8 text-center backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-200 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:shadow-slate-800/50'
              >
                <div className='relative mb-6 inline-block'>
                  <Image
                    width={96}
                    height={96}
                    src={member.image}
                    alt={member.name}
                    className='h-24 w-24 rounded-full border-4 border-white object-cover transition-transform duration-300 group-hover:scale-105 dark:border-slate-700'
                    loading='lazy'
                  />
                  <div className='absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 dark:from-emerald-400 dark:to-amber-400'>
                    <Utensils className='h-4 w-4 text-white' />
                  </div>
                </div>
                <h3 className='mb-2 text-xl font-bold text-slate-900 dark:text-slate-50'>
                  {member.name}
                </h3>
                <p className='mb-4 font-medium text-emerald-600 dark:text-emerald-400'>
                  {member.role}
                </p>
                <p className='text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className='relative overflow-hidden bg-gradient-to-br from-emerald-500 to-amber-500 py-20 dark:from-emerald-600 dark:to-amber-600'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+CjwvZz4KPC9nPgo8L3N2Zz4=')] opacity-20" />

        <div className='relative z-10 container mx-auto px-4'>
          <motion.div
            variants={itemVariants}
            className='mx-auto max-w-3xl text-center'
          >
            <h2 className='mb-6 text-3xl font-bold text-white md:text-4xl'>
              Ready to Join Our Culinary Community?
            </h2>
            <p className='mb-8 text-xl leading-relaxed text-white/90'>
              Share your favorite recipes, discover new flavors, and connect
              with fellow food enthusiasts from around the world.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <motion.button
                className='rounded-xl bg-white px-8 py-4 font-semibold text-emerald-600 shadow-lg transition-colors duration-300 hover:bg-slate-50 hover:shadow-xl'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Cooking
              </motion.button>
              <motion.button
                className='rounded-xl border-2 border-white bg-transparent px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-emerald-600'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
