const WelcomeText = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="text-center">
        <div style={{backgroundColor: '#ADD8E6'}} className="rounded-3xl p-8 shadow-lg border-2 border-orange-200 font-fun">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <img 
              src="/lovable-uploads/7877f657-a542-4479-a79d-5c919482ed36.png" 
              alt="Grandpa John at his desk with Buddy on his lap"
              className="w-64 h-64 rounded-xl object-cover shadow-lg flex-shrink-0 mx-auto md:mx-0"
              onLoad={() => console.log('Image loaded successfully:', '/lovable-uploads/7877f657-a542-4479-a79d-5c919482ed36.png')}
              onError={(e) => console.log('Image failed to load:', e)}
            />
            <div className="flex flex-col justify-center text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-amber-800 leading-relaxed mb-6">
                Welcome to my special place for children to enjoy stories!
              </h1>
              <p className="text-2xl text-amber-800 font-semibold leading-relaxed max-w-3xl mx-auto md:mx-0 font-fun">
                I am Grandpa John with my friend Buddy.<br />
                Here are stories, jokes, games and more.<br />
                Enjoy your time here!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeText;
