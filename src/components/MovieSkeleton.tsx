export const MovieSkeleton = () => {
  return (
    <div className="relative group block animate-pulse">
      <div className="rounded-md w-full aspect-[2/3] bg-gray-800" />
      <div className="mt-2 h-4 bg-gray-800 rounded w-3/4" />
    </div>
  );
};
