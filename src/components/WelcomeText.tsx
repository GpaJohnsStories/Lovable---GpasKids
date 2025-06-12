
const WelcomeText = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 shadow-lg border-2 border-orange-200 mb-4 font-fun">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-4">
            <img 
              src="/lovable-uploads/d05b3b1c-686e-4f7b-9844-38a790c9b067.png" 
              alt="Buddy - Grandpa John's beloved companion"
              className="w-48 h-48 rounded-xl object-cover shadow-lg flex-shrink-0 mx-auto md:mx-0"
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
