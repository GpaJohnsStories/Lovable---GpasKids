
export const getCategoryStyles = (category: string) => {
  switch (category) {
    case "Fun":
      return "bg-blue-500 text-white";
    case "Life":
      return "bg-green-500 text-white";
    case "North Pole":
      return "bg-red-600 text-white";
    case "World Changers":
      return "bg-amber-400 text-amber-900";
    default:
      return "bg-amber-200 text-amber-800";
  }
};

export const getCategoryDisplayName = (category: string) => {
  switch (category) {
    case "Life":
      return "Lessons and Stories From Grandpa John's Life";
    case "World Changers":
      return "World Changers — Real People Who Made A Difference";
    case "North Pole":
      return "Stories from the North Pole";
    case "Fun":
      return "Fun Jokes, Poems, Games & More";
    default:
      return category;
  }
};

export const renderCategoryBadge = (category: string) => {
  const displayName = getCategoryDisplayName(category);
  const styles = getCategoryStyles(category);
  
  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${styles}`} 
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {displayName}
    </span>
  );
};
