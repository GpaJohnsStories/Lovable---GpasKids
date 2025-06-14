

const WelcomeText = () => {
  return (
    <div className="container mx-auto px-4 py-4 -mt-16">
      <div className="text-center">
        <div style={{backgroundColor: '#ADD8E6'}} className="rounded-3xl p-8 shadow-lg border-2 border-orange-200 font-fun">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <img 
                src="/lovable-uploads/7877f657-a542-4479-a79d-5c919482ed36.png" 
                alt="Grandpa John at his desk with Buddy on his lap"
                className="w-64 h-64 rounded-xl object-cover shadow-lg flex-shrink-0 mx-auto md:mx-0"
                onLoad={() => console.log('Image loaded successfully:', '/lovable-uploads/7877f657-a542-4479-a79d-5c919482ed36.png')}
                onError={(e) => console.log('Image failed to load:', e)}
              />
              {/* Speech Balloon */}
              <div className="absolute -right-20 top-8 hidden md:block">
                <div className="relative bg-white rounded-2xl px-4 py-3 shadow-lg border-2 border-blue-300 max-w-40">
                  <p className="text-sm text-blue-900 font-bold italic leading-tight">
                    HURRY UP!!! We want to read!!!
                  </p>
                  {/* Speech balloon tail */}
                  <div className="absolute left-0 top-6 transform -translate-x-2">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-r-12 border-r-white border-b-8 border-b-transparent"></div>
                    <div className="absolute -left-0.5 -top-1 w-0 h-0 border-t-10 border-t-transparent border-r-14 border-r-blue-300 border-b-10 border-b-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-relaxed mb-6">
                Hello! <span className="inline-block animate-[wave_1s_ease-in-out_infinite] origin-[70%_70%]">👋</span>
              </h1>
              <p className="text-2xl text-blue-900 font-semibold leading-relaxed max-w-3xl mx-auto md:mx-0 font-fun">
                You have found my fun place for kids.<br />
                I am Grandpa John with my friend Buddy.<br />
                Here you will find stories, jokes, games and more.<br />
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

