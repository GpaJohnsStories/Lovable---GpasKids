
export interface StoryData {
  id: string | number;
  title: string;
  description: string;
  readTime: string;
  illustration: string;
  category: string;
  author: string;
  published?: string;
  photo_link_1?: string;
  photo_link_2?: string;
  photo_link_3?: string;
}

export const SAMPLE_STORIES: StoryData[] = [
  {
    id: 6,
    title: "Grandpa's Old Toolbox",
    description: "Sometimes the most valuable treasures are the lessons hidden in everyday things.",
    readTime: "6 min read",
    illustration: "🧰",
    category: "Life",
    author: "Michael Chen",
    published: "Y"
  },
  {
    id: 7,
    title: "The Christmas Star",
    description: "How one little star found its way to guide everyone home for the holidays.",
    readTime: "5 min read",
    illustration: "⭐",
    category: "North Pole",
    author: "Sarah Williams",
    published: "Y"
  },
  {
    id: 8,
    title: "The Little Teacher",
    description: "Meet Rosa Parks through the eyes of a child who witnessed history in the making.",
    readTime: "7 min read",
    illustration: "🚌",
    category: "World Changers",
    author: "David Rodriguez",
    published: "N"
  },
  {
    id: 9,
    title: "The Giggling Cookies",
    description: "What happens when cookies come to life and decide they don't want to be eaten?",
    readTime: "3 min read",
    illustration: "🍪",
    category: "Fun",
    author: "Lisa Park",
    published: "Y"
  },
  {
    id: 10,
    title: "The Day I Lost My Voice",
    description: "How I learned that sometimes listening is more powerful than speaking.",
    readTime: "8 min read",
    illustration: "🤐",
    category: "Life",
    author: "James Foster",
    published: "Y"
  },
  {
    id: 11,
    title: "Santa's Secret Helper",
    description: "Meet Pip, the elf who almost saved Christmas with just a paper clip and determination.",
    readTime: "6 min read",
    illustration: "🎅",
    category: "North Pole",
    author: "Maria Garcia",
    published: "N"
  },
  {
    id: 12,
    title: "The Boy Who Planted Hope",
    description: "Learn about Wangari Maathai through the story of a boy inspired by her tree-planting mission.",
    readTime: "9 min read",
    illustration: "🌱",
    category: "World Changers",
    author: "Robert Kim",
    published: "Y"
  }
];

export const getNewestStories = (realStories: any[] = []): StoryData[] => {
  console.log('Real stories from database:', realStories);
  
  const realStoryData = realStories.slice(0, 1).map(story => ({
    id: story.id,
    title: story.title,
    description: story.excerpt || story.tagline || "A wonderful story waiting to be discovered.",
    readTime: "5 min read",
    illustration: "📖",
    category: story.category,
    author: story.author,
    published: story.published,
    photo_link_1: story.photo_link_1,
    photo_link_2: story.photo_link_2,
    photo_link_3: story.photo_link_3
  }));

  // Filter sample stories to only include published ones
  const publishedSampleStories = SAMPLE_STORIES.filter(story => story.published === 'Y');
  console.log('Published sample stories:', publishedSampleStories);
  
  const newestStories = [...realStoryData, ...publishedSampleStories.slice(0, 3)].slice(0, 4);
  console.log('Final newest stories:', newestStories);
  
  return newestStories;
};

export const getPopularStories = (): StoryData[] => {
  // Filter sample stories to only include published ones
  const publishedSampleStories = SAMPLE_STORIES.filter(story => story.published === 'Y');
  console.log('All published sample stories:', publishedSampleStories);
  
  // Get popular stories starting from index 1 (skip the first one used in newest)
  const popularStories = publishedSampleStories.slice(1);
  console.log('Final popular stories:', popularStories);
  
  return popularStories;
};
