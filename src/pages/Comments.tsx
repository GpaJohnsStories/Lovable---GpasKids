
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";

const Comments = () => {
  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <WelcomeHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-orange-200">
          <h1 className="text-3xl font-bold text-center text-orange-800 mb-4 font-fun">
            Comments, Questions & Feedback
          </h1>
          <p className="text-center text-orange-800 font-fun">
            Welcome to our Comment, Questions & Feedback page! We value your input as we grow and improve our website. Please take a moment to read our basic rules for engagement to ensure a positive and productive environment for everyone.
          </p>
        </div>
      </main>
      <CookieFreeFooter />
    </div>
  );
};

export default Comments;
