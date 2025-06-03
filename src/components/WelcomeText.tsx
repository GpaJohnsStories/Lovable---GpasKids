
const WelcomeText = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 shadow-lg border-2 border-orange-200 mb-8">
          <div className="flex items-start gap-6 mb-4">
            <img 
              src="/lovable-uploads/c3b88b23-b809-4f82-9c07-a90f95a3bde5.png" 
              alt="Grandpa John and his friend Buddy"
              className="w-32 h-32 rounded-xl object-cover shadow-lg flex-shrink-0"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-amber-800 leading-relaxed font-serif text-left flex-1">
              Welcome to my special place for children to enjoy stories!
            </h1>
          </div>
          <p className="text-xl text-amber-700 mb-6 leading-relaxed max-w-3xl mx-auto">
            After living a long time and having 10 wonderful grandchildren, I have lots of stories! 
            These stories are special because they come from my heart, and are full of exciting things, laughs, and the kind of magic 
            you find when you read and let your mind go on an adventure.
          </p>
          <p className="text-lg text-amber-600 mb-6 leading-relaxed max-w-2xl mx-auto italic">
            "Every story I tell is a gift from my heart to yours. Come and read and create some magical memories."
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeText;
