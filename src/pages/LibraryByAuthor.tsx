import React from "react";
import { Helmet } from 'react-helmet-async';
import CookieFreeFooter from "@/components/CookieFreeFooter";
import PublicStoriesByAuthor from "@/components/PublicStoriesByAuthor";
import WelcomeHeader from "@/components/WelcomeHeader";
import ScrollToTop from "@/components/ScrollToTop";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const LibraryByAuthor = () => {
  return (
    <>
      <Helmet>
        <title>Library by Author - Stories Grouped by Author | GpasKids.com</title>
        <meta name="description" content="Browse our collection of children's stories organized by author. Find all stories from your favorite storytellers in one place." />
        <meta name="keywords" content="children stories by author, kids stories, storytellers, children's books, bedtime stories" />
        <link rel="canonical" href="/library/by-author" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        <main className="container mx-auto px-4 pt-2">
          <div className="mb-4">
            <Link to="/library">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Library
              </Button>
            </Link>
            
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-orange-800 mb-2" style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}>
                Library by Author
              </h1>
              <p className="text-lg text-orange-700">
                Stories organized by their wonderful authors
              </p>
            </div>
          </div>
          
          <div className="mb-8">
            <PublicStoriesByAuthor />
          </div>
        </main>
        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    </>
  );
};

export default LibraryByAuthor;