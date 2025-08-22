
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
  content?: string;
  tagline?: string;
  story_code?: string;
  excerpt?: string;
  thumbs_up_count?: number;
  thumbs_down_count?: number;
  ok_count?: number;
}

export const getNewestStories = (realStories: any[] = []): StoryData[] => {
  console.log('Real stories from database:', realStories);
  
  const realStoryData = realStories.map(story => ({
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
    photo_link_3: story.photo_link_3,
    content: story.content,
    tagline: story.tagline,
    story_code: story.story_code,
    excerpt: story.excerpt,
    thumbs_up_count: story.thumbs_up_count,
    thumbs_down_count: story.thumbs_down_count,
    ok_count: story.ok_count
  }));

  console.log('Final newest stories:', realStoryData);
  
  return realStoryData;
};

export const getPopularStories = (): StoryData[] => {
  // Return empty array since we're only using real stories from database now
  console.log('Popular stories: returning empty array, using only real database stories');
  
  return [];
};
