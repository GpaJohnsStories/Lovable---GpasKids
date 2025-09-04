
export const getCategoryStyles = (category: string) => {
  switch (category) {
    case "Fun":
      return "bg-gradient-to-b from-blue-400 to-blue-600 border-blue-700 shadow-[0_6px_12px_rgba(37,99,235,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
    case "Life":
      return "bg-gradient-to-b from-green-400 to-green-600 border-green-700 shadow-[0_6px_12px_rgba(34,197,94,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
    case "North Pole":
      return "bg-gradient-to-b from-red-400 to-red-600 border-red-700 shadow-[0_6px_12px_rgba(239,68,68,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
    case "World Changers":
      return "bg-gradient-to-b from-amber-400 to-amber-600 border-amber-700 shadow-[0_6px_12px_rgba(245,158,11,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-amber-900";
    case "WebText":
      return "bg-gradient-to-b from-purple-400 to-purple-600 border-purple-700 shadow-[0_6px_12px_rgba(147,51,234,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
    case "BioText":
      return "bg-gradient-to-b from-teal-400 to-teal-600 border-teal-700 shadow-[0_6px_12px_rgba(20,184,166,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
    case "Admin":
      return "bg-gradient-to-b from-yellow-400 to-yellow-600 border-[#eab308] shadow-[0_6px_12px_rgba(234,179,8,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-[#3b82f6]";
    default:
      return "bg-gradient-to-b from-gray-400 to-gray-600 border-gray-700 shadow-[0_6px_12px_rgba(75,85,99,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
  }
};

// For full descriptive names (used on story pages)
export const getCategoryDisplayName = (category: string) => {
  switch (category) {
    case "Life":
      return "Life Lessons — Lessons and Stories From Grandpa John's Life";
    case "World Changers":
      return "World Changers — Real People Who Made A Difference";
    case "North Pole":
      return "Stories from the North Pole";
    case "Fun":
      return "Fun Stuff — Fun Jokes, Poems, Games & More";
    case "BioText":
      return "Biographies — Life Stories of Remarkable People";
    case "Admin":
      return "Admin";
    default:
      return category;
  }
};

// For short names (used in library list tables)
export const getCategoryShortName = (category: string) => {
  switch (category) {
    case "Life":
      return "Life Lessons";
    case "World Changers":
      return "World Changers";
    case "North Pole":
      return "North Pole";
    case "Fun":
      return "Fun Stuff";
    case "BioText":
      return "Biographies";
    case "Admin":
      return "Admin";
    default:
      return category;
  }
};

export const renderCategoryBadge = (category: string) => {
  const displayName = getCategoryDisplayName(category);
  const styles = getCategoryStyles(category);
  
  return (
    <span 
      className={`inline-flex items-center px-4 py-2 rounded text-21px font-bold ${styles}`} 
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {displayName}
    </span>
  );
};
