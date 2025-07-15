import RecipeDetails from '@/components/root/RecipeDetails';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RecipeDetails id={id} />;
}
