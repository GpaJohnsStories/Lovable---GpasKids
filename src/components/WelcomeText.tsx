

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
              {/* Speech Bubble Image */}
              <div className="absolute -right-16 top-4 hidden md:block">
                <img 
                  src="/lovable-uploads/c123cf14-65c8-44b5-9dc1-10d4e5636d1a.png" 
                  alt="Speech bubble saying HURRY UP!!! We want to READ!!!"
                  className="w-32 h-24 object-contain"
                  onLoad={() => console.log('Speech bubble image loaded successfully')}
                  onError={(e) => console.log('Speech bubble image failed to load:', e)}
                />
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

