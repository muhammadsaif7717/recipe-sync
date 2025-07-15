'use client';

import { FormEvent, useState, useRef } from 'react';
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
  User,
  Check,
  X,
  Camera,
  Upload,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const router = useRouter();
  console.log(profileImageFile);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    profileImageUrl: '',
  });

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    setPasswordChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const uploadToImgBB = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      formData,
    );

    if (response.status !== 200) {
      throw new Error('Failed to upload image');
    }

    return response.data.data.url; // ✅ Return image URL
  };

  const handleImageUpload = async (file: File) => {
    setUploadError('');
    setIsUploading(true);

    // Validate file
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      setIsUploading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setUploadError('Image size must be less than 5MB');
      setIsUploading(false);
      return;
    }

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to ImgBB
      const imageUrl = await uploadToImgBB(file);

      setProfileImageFile(file);
      setFormData({ ...formData, profileImageUrl: imageUrl });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      setProfileImage(null);
      setProfileImageFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfileImageFile(null);
    setFormData({ ...formData, profileImageUrl: '' });
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      setIsLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        image: formData.profileImageUrl,
        role: 'user',
        isSignUp: true,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError(
          result.error === 'CredentialsSignin'
            ? 'User already exists'
            : 'Something went wrong',
        );
      } else {
        router.push(callbackUrl); // Redirect to dashboard or home page
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

  const isPasswordValid = Object.values(passwordChecks).every((check) => check);
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== '';

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

        {/* Sign Up Card */}
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
              Join RecipeSync
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className='text-slate-600 dark:text-slate-300'
            >
              Create your account to start sharing recipes
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
                or create an account
              </span>
            </div>
          </motion.div>

          {/* Sign Up Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            onSubmit={handleSubmit}
            className='space-y-6'
          >
            {/* Profile Picture Upload */}
            <div>
              <label className='mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Profile Picture (Optional)
              </label>
              <div className='flex flex-col items-center space-y-4'>
                {/* Profile Image Preview */}
                <div className='relative'>
                  {profileImage ? (
                    <div className='relative'>
                      <Image
                        height={24}
                        width={24}
                        src={profileImage}
                        alt='Profile preview'
                        className='h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg dark:border-slate-700'
                      />
                      <button
                        type='button'
                        onClick={removeImage}
                        className='absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </div>
                  ) : (
                    <div className='flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-slate-100 shadow-lg dark:border-slate-700 dark:bg-slate-800'>
                      <Camera className='h-8 w-8 text-slate-400 dark:text-slate-500' />
                    </div>
                  )}
                  {isUploading && (
                    <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50'>
                      <Loader2 className='h-6 w-6 animate-spin text-white' />
                    </div>
                  )}
                </div>

                {/* Upload Area */}
                <div
                  className={`relative w-full rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                    dragOver
                      ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/10'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleFileSelect}
                    className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
                    disabled={isUploading}
                  />
                  <div className='flex flex-col items-center space-y-2'>
                    <Upload className='h-8 w-8 text-slate-400 dark:text-slate-500' />
                    <div className='text-sm text-slate-600 dark:text-slate-300'>
                      <span className='font-medium text-emerald-600 dark:text-emerald-400'>
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </div>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>

                {/* Upload Error */}
                {uploadError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='text-sm text-red-600 dark:text-red-400'
                  >
                    {uploadError}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Name Fields */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                  First Name
                </label>
                <div className='relative'>
                  <User className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500' />
                  <input
                    type='text'
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className='w-full rounded-xl border border-slate-200 bg-white/50 py-3 pr-4 pl-10 text-slate-900 placeholder-slate-400 transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:ring-emerald-400'
                    placeholder='John'
                  />
                </div>
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                  Last Name
                </label>
                <div className='relative'>
                  <User className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500' />
                  <input
                    type='text'
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className='w-full rounded-xl border border-slate-200 bg-white/50 py-3 pr-4 pl-10 text-slate-900 placeholder-slate-400 transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:ring-emerald-400'
                    placeholder='Doe'
                  />
                </div>
              </div>
            </div>

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
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className='w-full rounded-xl border border-slate-200 bg-white/50 py-3 pr-12 pl-10 text-slate-900 placeholder-slate-400 transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:ring-emerald-400'
                  placeholder='Create a strong password'
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className='mt-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50'
                >
                  <div className='grid grid-cols-2 gap-2 text-xs'>
                    {(
                      [
                        { key: 'length', label: '8+ characters' },
                        { key: 'uppercase', label: 'Uppercase' },
                        { key: 'lowercase', label: 'Lowercase' },
                        { key: 'number', label: 'Number' },
                        { key: 'special', label: 'Special char' },
                      ] as const
                    ).map(({ key, label }) => (
                      <div key={key} className='flex items-center gap-2'>
                        {passwordChecks[key] ? (
                          <Check className='h-3 w-3 text-emerald-500' />
                        ) : (
                          <X className='h-3 w-3 text-slate-400' />
                        )}
                        <span
                          className={
                            passwordChecks[key]
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-500'
                          }
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Confirm Password
              </label>
              <div className='relative'>
                <Lock className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500' />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className={`w-full rounded-xl border bg-white/50 py-3 pr-12 pl-10 text-slate-900 placeholder-slate-400 transition-all focus:border-transparent focus:ring-2 focus:outline-none dark:bg-slate-800/50 dark:text-slate-50 dark:placeholder-slate-500 ${
                    formData.confirmPassword === ''
                      ? 'border-slate-200 focus:ring-emerald-500 dark:border-slate-700 dark:focus:ring-emerald-400'
                      : passwordsMatch
                        ? 'border-emerald-500 focus:ring-emerald-500 dark:border-emerald-400 dark:focus:ring-emerald-400'
                        : 'border-rose-500 focus:ring-rose-500 dark:border-rose-400 dark:focus:ring-rose-400'
                  }`}
                  placeholder='Confirm your password'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='mt-2 text-sm text-rose-600 dark:text-rose-400'
                >
                  Passwords do not match
                </motion.p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className='flex items-start'>
              <input
                type='checkbox'
                required
                checked={formData.agreeToTerms}
                onChange={(e) =>
                  setFormData({ ...formData, agreeToTerms: e.target.checked })
                }
                className='mt-1 h-4 w-4 rounded border-slate-300 bg-white text-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-emerald-400 dark:focus:ring-emerald-400'
              />
              <label className='ml-3 text-sm text-slate-600 dark:text-slate-300'>
                I agree to the{' '}
                <Link
                  href='/terms'
                  className='text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href='/privacy'
                  className='text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Sign Up Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={
                isLoading ||
                !isPasswordValid ||
                !passwordsMatch ||
                !formData.agreeToTerms
              }
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
                    Creating account...
                  </motion.div>
                ) : (
                  <motion.span
                    key='text'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Create Account
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>

          {/* Sign In Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className='mt-6 text-center'
          >
            <p className='text-slate-600 dark:text-slate-300'>
              Already have an account?{' '}
              <Link
                href='/auth/sign-in'
                className='font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
