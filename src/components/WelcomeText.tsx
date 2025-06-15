
import { Link, useLocation } from "react-router-dom";

const WelcomeText = () => {
  const location = useLocation();

  return (
    <div className="w-full py-4 mt-0" style={{backgroundColor: '#ADD8E6'}}>
      <div className="rounded-3xl p-8 shadow-lg border-2 border-orange-200 font-fun container mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="relative">
            <img 
              src="/lovable-uploads/7877f657-a542-4479-a79d-5c919482ed36.png" 
              alt="Grandpa John at his desk with Buddy on his lap"
              className="w-64 h-64 rounded-xl object-cover shadow-lg flex-shrink-0 mx-auto md:mx-0"
              onLoad={() => console.log('Image loaded successfully:', '/lovable-uploads/7877f657-a542-4479-a79d-5c919482ed36.png')}
              onError={(e) => console.log('Image failed to load:', e)}
            />
          </div>
          <div className="flex flex-col justify-center text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-relaxed mb-6">
              Hello!
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
  );
};

export default WelcomeText;
