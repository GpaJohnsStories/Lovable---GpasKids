
const WelcomeText = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 shadow-lg border-2 border-orange-200 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-4">
            <img 
              src="/lovable-uploads/c3b88b23-b809-4f82-9c07-a90f95a3bde5.png" 
              alt="Grandpa John and his friend Buddy"
              className="w-44 h-44 rounded-xl object-cover shadow-lg flex-shrink-0 mx-auto md:mx-0"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-amber-800 leading-relaxed font-serif text-center md:text-left flex-1">
              Welcome to my special place for children to enjoy stories!
            </h1>
          </div>
          <p className="text-xl text-amber-700 mb-6 leading-relaxed max-w-3xl mx-auto">
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
