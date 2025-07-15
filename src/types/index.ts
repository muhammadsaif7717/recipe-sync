import { LucideIcon } from 'lucide-react';

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export interface Step {
  id: string;
  instruction: string;
  duration?: number;
}

export interface Author {
  name: string;
  avatar: string;
  email: string;
}

export interface Recipe {
  _id?: string;
  title: string;
  description: string;
  image: string;
  cookTime: number;
  prepTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  author: Author;
  status: 'pending' | 'published';
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string;
}

export interface ActionButtonProps {
  Icon: LucideIcon;
  label: string;
  href: string;
}

export interface StatCardProps {
  Icon: LucideIcon;
  label: string;
  value: number;
  color: 'emerald' | 'amber' | 'rose' | 'blue';
}
