
const WelcomeText = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 shadow-lg border-2 border-orange-200 mb-4 font-fun">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-4">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" 
              alt="Grandpa John and his friend Buddy"
              className="w-48 h-48 rounded-xl object-cover shadow-lg flex-shrink-0 mx-auto md:mx-0"
              onLoad={() => console.log('Image loaded successfully')}
            />
            <h1 className="text-4xl md:text-5xl font-bold text-amber-800 leading-relaxed text-center md:text-left flex-1">
              Welcome to my special place for children to enjoy stories!
            </h1>
          </div>
          <p className="text-2xl text-amber-800 font-semibold mb-6 leading-relaxed max-w-3xl mx-auto">
            I am Grandpa John with my friend Buddy.<br />
            Here are stories, jokes, games and more.<br />
            Enjoy your time here!
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeText;
