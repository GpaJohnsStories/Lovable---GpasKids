
const WelcomeText = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 shadow-lg border-2 border-orange-200 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-4 leading-relaxed font-serif">
            Welcome to my special place for children to enjoy stories! 👋
          </h1>
          <p className="text-xl text-amber-700 mb-6 leading-relaxed max-w-3xl mx-auto">
            With over 80 years of life experience and 10 wonderful grandchildren, I have many stories to share with you. 
            Each one comes straight from my heart, filled with wonder, laughter, and the kind of magic 
            that happens when we sit together and let our imaginations soar.
          </p>
          <p className="text-lg text-amber-600 mb-6 leading-relaxed max-w-2xl mx-auto italic">
            "Every story I tell is a gift from my heart to yours. Come, let's create some magical memories together!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeText;
