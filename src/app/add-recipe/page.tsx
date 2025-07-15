'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  X,
  Upload,
  Clock,
  ChefHat,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { getURL } from '@/lib/getURL';
import Image from 'next/image';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Author, Ingredient, Recipe, Step } from '@/types';

const cuisineOptions = [
  'Italian',
  'Thai',
  'Chinese',
  'Mexican',
  'Indian',
  'French',
  'Japanese',
  'Mediterranean',
  'American',
  'British',
  'Korean',
  'Vietnamese',
  'Other',
];

const commonTags = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Low-Carb',
  'Keto',
  'Healthy',
  'Quick',
  'Comfort Food',
  'Spicy',
  'Sweet',
  'Savory',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snack',
  'Appetizer',
];

let url: string;
// Initialize the URL
const initializeURL = async () => {
  url = await getURL();
};
initializeURL();

export default function AddRecipePage() {
  const session = useSession();
  // Author variable as requested
  const author: Author = {
    name: session.data?.user.name as string,
    avatar: session.data?.user.image as string,
    email: session.data?.user.email as string,
  };
  const [recipe, setRecipe] = useState<Recipe>({
    title: '',
    description: '',
    image: '',
    cookTime: 30,
    prepTime: 15,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Italian',
    tags: [],
    ingredients: [{ id: '1', name: '', amount: '', unit: 'cups' }],
    steps: [{ id: '1', instruction: '' }],
    author: author,
    status: 'pending',
  });

  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image upload handler
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload to ImgBB
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.success) {
        const imageUrl = response.data.data.url;
        setRecipe((prev) => ({
          ...prev,
          image: imageUrl,
        }));
        setImagePreview(imageUrl);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.info('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      amount: '',
      unit: 'cups',
    };
    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient],
    }));
  };

  const removeIngredient = (id: string) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ing) => ing.id !== id),
    }));
  };

  const updateIngredient = (
    id: string,
    field: keyof Ingredient,
    value: string,
  ) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing,
      ),
    }));
  };

  const addStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      instruction: '',
    };
    setRecipe((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
  };

  const removeStep = (id: string) => {
    setRecipe((prev) => ({
      ...prev,
      steps: prev.steps.filter((step) => step.id !== id),
    }));
  };

  const updateStep = (
    id: string,
    field: keyof Step,
    value: string | number,
  ) => {
    setRecipe((prev) => ({
      ...prev,
      steps: prev.steps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step,
      ),
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !recipe.tags.includes(tag)) {
      setRecipe((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setRecipe((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${url}/api/v1/recipes/post`, recipe);

      if (response.status === 201) {
        toast('Recipe Created Successfully! 🎉', {
          description: 'Your delicious recipe is now live and ready to share!',
          duration: 5000,
          position: 'top-center',
          className:
            'border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 text-gray-800',
          style: {
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '16px',
            fontWeight: '500',
            boxShadow:
              '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          },
        });

        // Reset form
        setRecipe({
          title: '',
          description: '',
          image: '',
          cookTime: 30,
          prepTime: 15,
          servings: 4,
          difficulty: 'Medium',
          cuisine: 'Italian',
          tags: [],
          ingredients: [{ id: '1', name: '', amount: '', unit: 'cups' }],
          steps: [{ id: '1', instruction: '' }],
          author: author,
          status: 'pending',
        });
        setImagePreview('');
      } else {
        toast.info('❌ Failed to create recipe.');
      }
    } catch (error) {
      console.error(error);
    }

    setIsSubmitting(false);
  };

  const unitOptions = [
    'cups',
    'tbsp',
    'tsp',
    'oz',
    'lb',
    'g',
    'kg',
    'ml',
    'l',
    'pieces',
    'cloves',
    'pinch',
  ];

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950'>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='relative bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10 px-4 py-16 sm:px-6 lg:px-8 dark:from-emerald-400/10 dark:to-amber-400/10'
      >
        <div className='mx-auto max-w-4xl text-center'>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className='mb-4 inline-flex items-center gap-2'
          >
            <ChefHat className='h-8 w-8 text-emerald-500 dark:text-emerald-400' />
            <h1 className='text-4xl font-bold text-slate-900 md:text-5xl dark:text-slate-50'>
              Share Your Recipe
            </h1>
          </motion.div>
          <p className='mx-auto mb-8 max-w-2xl text-xl text-slate-600 dark:text-slate-300'>
            Create and share your delicious recipes with the RecipeSync
            community. Help others discover amazing flavors!
          </p>
        </div>
      </motion.section>

      {/* Form Section */}
      <section className='px-4 py-8 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl'>
          <form onSubmit={handleSubmit} className='space-y-8'>
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className='border-slate-200/50 bg-white/80 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80'>
                <CardHeader>
                  <CardTitle className='text-slate-900 dark:text-slate-50'>
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div>
                    <Label
                      htmlFor='title'
                      className='text-slate-700 dark:text-slate-300'
                    >
                      Recipe Title
                    </Label>
                    <Input
                      id='title'
                      value={recipe.title}
                      onChange={(e) =>
                        setRecipe((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder='Enter a delicious recipe name...'
                      className='mt-2 border-slate-200/50 bg-white/50 focus:border-emerald-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:focus:border-emerald-400'
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor='description'
                      className='text-slate-700 dark:text-slate-300'
                    >
                      Description
                    </Label>
                    <Textarea
                      id='description'
                      value={recipe.description}
                      onChange={(e) =>
                        setRecipe((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder='Describe your recipe - what makes it special?'
                      rows={3}
                      className='mt-2 border-slate-200/50 bg-white/50 focus:border-emerald-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:focus:border-emerald-400'
                      required
                    />
                  </div>

                  <div>
                    <Label className='text-slate-700 dark:text-slate-300'>
                      Recipe Image
                    </Label>

                    {/* Image Upload Area */}
                    <div className='mt-2 space-y-4'>
                      {/* Drag and drop area */}
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className='relative rounded-lg border-2 border-dashed border-slate-300 p-6 text-center transition-colors hover:border-emerald-400 dark:border-slate-600 dark:hover:border-emerald-400'
                      >
                        <input
                          ref={fileInputRef}
                          type='file'
                          accept='image/*'
                          onChange={handleFileInputChange}
                          className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
                        />

                        {isUploadingImage ? (
                          <div className='flex flex-col items-center gap-2'>
                            <div className='h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent'></div>
                            <p className='text-sm text-slate-600 dark:text-slate-400'>
                              Uploading image...
                            </p>
                          </div>
                        ) : (
                          <div className='flex flex-col items-center gap-2'>
                            <Upload className='h-8 w-8 text-slate-400' />
                            <p className='text-sm text-slate-600 dark:text-slate-400'>
                              Drag and drop an image, or{' '}
                              <span className='cursor-pointer text-emerald-500 hover:text-emerald-600'>
                                click to browse
                              </span>
                            </p>
                            <p className='text-xs text-slate-500 dark:text-slate-500'>
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                        )}
                      </div>

                      {/* URL Input */}
                      <div className='flex gap-2'>
                        <Input
                          value={recipe.image}
                          onChange={(e) => {
                            setRecipe((prev) => ({
                              ...prev,
                              image: e.target.value,
                            }));
                            setImagePreview(e.target.value);
                          }}
                          placeholder='Or paste image URL here...'
                          className='border-slate-200/50 bg-white/50 focus:border-emerald-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:focus:border-emerald-400'
                        />
                        <Button
                          type='button'
                          variant='outline'
                          className='px-3'
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingImage}
                        >
                          <ImageIcon className='h-4 w-4' />
                        </Button>
                      </div>

                      {/* Image Preview */}
                      {(imagePreview || recipe.image) && (
                        <div className='relative'>
                          <Image
                            width={600}
                            height={400}
                            src={imagePreview || recipe.image}
                            alt='Recipe preview'
                            className='h-48 w-full rounded-lg border border-slate-200 object-cover dark:border-slate-700'
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                            onLoad={() => {
                              if (!imagePreview && recipe.image) {
                                setImagePreview(recipe.image);
                              }
                            }}
                          />
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            className='absolute top-2 right-2 bg-white/90 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900'
                            onClick={() => {
                              setRecipe((prev) => ({ ...prev, image: '' }));
                              setImagePreview('');
                            }}
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                    <div>
                      <Label
                        htmlFor='prepTime'
                        className='text-slate-700 dark:text-slate-300'
                      >
                        Prep Time (min)
                      </Label>
                      <Input
                        id='prepTime'
                        type='number'
                        value={recipe.prepTime}
                        onChange={(e) =>
                          setRecipe((prev) => ({
                            ...prev,
                            prepTime: Number(e.target.value),
                          }))
                        }
                        className='mt-2 border-slate-200/50 bg-white/50 focus:border-emerald-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:focus:border-emerald-400'
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor='cookTime'
                        className='text-slate-700 dark:text-slate-300'
                      >
                        Cook Time (min)
                      </Label>
                      <Input
                        id='cookTime'
                        type='number'
                        value={recipe.cookTime}
                        onChange={(e) =>
                          setRecipe((prev) => ({
                            ...prev,
                            cookTime: Number(e.target.value),
                          }))
                        }
                        className='mt-2 border-slate-200/50 bg-white/50 focus:border-emerald-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:focus:border-emerald-400'
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor='servings'
                        className='text-slate-700 dark:text-slate-300'
                      >
                        Servings
                      </Label>
                      <Input
                        id='servings'
                        type='number'
                        value={recipe.servings}
                        onChange={(e) =>
                          setRecipe((prev) => ({
                            ...prev,
                            servings: Number(e.target.value),
                          }))
                        }
                        className='mt-2 border-slate-200/50 bg-white/50 focus:border-emerald-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:focus:border-emerald-400'
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor='difficulty'
                        className='text-slate-700 dark:text-slate-300'
                      >
                        Difficulty
                      </Label>
                      <select
                        id='difficulty'
                        value={recipe.difficulty}
                        onChange={(e) =>
                          setRecipe((prev) => ({
                            ...prev,
                            difficulty: e.target.value as
                              | 'Easy'
                              | 'Medium'
                              | 'Hard',
                          }))
                        }
                        className='mt-2 w-full rounded-md border border-slate-200/50 bg-white/50 px-3 py-2 focus:border-emerald-500 focus:outline-none dark:border-slate-700/50 dark:bg-slate-800/50 dark:focus:border-emerald-400'
                      >
                        <option value='Easy'>Easy</option>
                        <option value='Medium'>Medium</option>
                        <option value='Hard'>Hard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor='cuisine'
                      className='text-slate-700 dark:text-slate-300'
                    >
                      Cuisine Type
                    </Label>
                    <select
                      id='cuisine'
                      value={recipe.cuisine}
                      onChange={(e) =>
                        setRecipe((prev) => ({
                          ...prev,
                          cuisine: e.target.value,
                        }))
                      }
                      className='mt-2 w-full rounded-md border border-slate-200/50 bg-white/50 px-3 py-2 focus:border-emerald-500 focus:outline-none dark:border-slate-700/50 dark:bg-slate-800/50 dark:focus:border-emerald-400'
                    >
                      {cuisineOptions.map((cuisine) => (
                        <option key={cuisine} value={cuisine}>
                          {cuisine}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className='border-slate-200/50 bg-white/80 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80'>
                <CardHeader>
                  <CardTitle className='text-slate-900 dark:text-slate-50'>
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex flex-wrap gap-2'>
                    {commonTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={
                          recipe.tags.includes(tag) ? 'default' : 'outline'
                        }
                        className={`cursor-pointer transition-colors ${
                          recipe.tags.includes(tag)
                            ? 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-500'
                            : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                        }`}
                        onClick={() =>
                          recipe.tags.includes(tag)
                            ? removeTag(tag)
                            : addTag(tag)
                        }
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className='flex gap-2'>
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder='Add custom tag...'
                      className='border-slate-200/50 bg-white/50 focus:border-emerald-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:focus:border-emerald-400'
                      onKeyPress={(e) =>
                        e.key === 'Enter' &&
                        (e.preventDefault(), addTag(newTag))
                      }
                    />
                    <Button
                      type='button'
                      onClick={() => addTag(newTag)}
                      variant='outline'
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>

                  {recipe.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {recipe.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className='bg-emerald-500 dark:bg-emerald-400'
                        >
                          {tag}
                          <button
                            type='button'
                            onClick={() => removeTag(tag)}
                            className='ml-1 hover:text-red-500'
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Ingredients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className='border-slate-200/50 bg-white/80 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80'>
                <CardHeader>
                  <CardTitle className='text-slate-900 dark:text-slate-50'>
                    Ingredients
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {recipe.ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className='flex items-center gap-2'
                    >
                      <span className='w-8 text-sm font-medium text-slate-500 dark:text-slate-400'>
                        {index + 1}.
                      </span>
                      <Input
                        value={ingredient.amount}
                        onChange={(e) =>
                          updateIngredient(
                            ingredient.id,
                            'amount',
                            e.target.value,
                          )
                        }
                        placeholder='1'
                        className='w-20 border-slate-200/50 bg-white/50 focus:border-emerald-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:focus:border-emerald-400'
                      />
                      <select
                        value={ingredient.unit}
                        onChange={(e) =>
                          updateIngredient(
                            ingredient.id,
                            'unit',
                            e.target.value,
                          )
                        }
                        className='rounded-md border border-slate-200/50 bg-white/50 px-3 py-2 focus:border-emerald-500 focus:outline-none dark:border-slate-700/50 dark:bg-slate-800/50 dark:focus:border-emerald-400'
                      >
                        {unitOptions.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                      <Input
                        value={ingredient.name}
                        onChange={(e) =>
                          updateIngredient(
                            ingredient.id,
                            'name',
                            e.target.value,
                          )
                        }
                        placeholder='Ingredient name'
                        className='flex-1 border-slate-200/50 bg-white/50 focus:border-emerald-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:focus:border-emerald-400'
                        required
                      />
                      {recipe.ingredients.length > 1 && (
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => removeIngredient(ingredient.id)}
                          className='text-red-500 hover:text-red-600'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                  <Button
                    type='button'
                    variant='outline'
                    onClick={addIngredient}
                    className='mt-4 w-full'
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Add Ingredient
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className='border-slate-200/50 bg-white/80 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80'>
                <CardHeader>
                  <CardTitle className='text-slate-900 dark:text-slate-50'>
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {recipe.steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className='space-y-2'
                    >
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                          Step {index + 1}
                        </span>
                        {recipe.steps.length > 1 && (
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => removeStep(step.id)}
                            className='ml-auto text-red-500 hover:text-red-600'
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                      <Textarea
                        value={step.instruction}
                        onChange={(e) =>
                          updateStep(step.id, 'instruction', e.target.value)
                        }
                        placeholder='Describe this step in detail...'
                        rows={3}
                        className='border-slate-200/50 bg-white/50 focus:border-emerald-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:focus:border-emerald-400'
                        required
                      />
                      <div className='flex items-center gap-2'>
                        <Clock className='h-4 w-4 text-slate-400' />
                        <Input
                          type='number'
                          value={step.duration || ''}
                          onChange={(e) =>
                            updateStep(
                              step.id,
                              'duration',
                              Number(e.target.value),
                            )
                          }
                          placeholder='Time (min)'
                          className='w-32 border-slate-200/50 bg-white/50 focus:border-emerald-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:focus:border-emerald-400'
                        />
                        <span className='text-sm text-slate-500 dark:text-slate-400'>
                          minutes (optional)
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  <Button
                    type='button'
                    variant='outline'
                    onClick={addStep}
                    className='mt-4 w-full'
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Add Step
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className='flex justify-center'
            >
              <Button
                type='submit'
                disabled={isSubmitting}
                className='bg-emerald-500 px-8 py-3 text-lg hover:bg-emerald-600 disabled:opacity-50 dark:bg-emerald-400 dark:hover:bg-emerald-500'
              >
                {isSubmitting ? (
                  <>
                    <div className='mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
                    Publishing Recipe...
                  </>
                ) : (
                  <>
                    <ChefHat className='mr-2 h-5 w-5' />
                    Publish Recipe
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </section>
    </div>
  );
}
