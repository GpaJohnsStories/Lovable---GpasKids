import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Cookie, Eye, Lock } from "lucide-react";
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <WelcomeHeader />
      
      <div className="max-w-4xl mx-auto p-6">
        {/* My PROMISE to YOU! section moved from About page */}
        <div 
          className="border-2 border-amber-600 rounded-xl px-16 py-8 shadow-xl relative overflow-hidden mb-8"
          style={{
            backgroundImage: `url('/lovable-uploads/2a50a95f-ad31-4394-b52c-f65e3bc6f5b3.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-amber-900 mb-6 text-center" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
              <div className="inline-block">
                My Promise To You!
                <div className="w-full h-1 bg-amber-900 mt-2"></div>
              </div>
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-amber-900 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                <span className="font-bold">Safety First</span>: This website is designed with children's safety in mind. There are no advertisements, no personal data collection, and strict security measures.
              </p>
              <p className="text-lg text-amber-900 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                <span className="font-bold">Quality Content</span>: All stories are written by me or by my friends and then edited by me. They are carefully crafted to be engaging, age-appropriate for grade school students, encouraging, and meaningful.
              </p>
              <p className="text-lg text-amber-900 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                <span className="font-bold">A Comfortable Space</span>: I want you to feel at home here – like you're sitting in a cozy chair listening to your own grandparent tell you a story.
              </p>
            </div>
            
            {/* Thank you message */}
            <div className="mt-8 text-center clear-right">
              <p className="text-lg text-blue-800 font-bold leading-relaxed italic mb-6" style={{ fontFamily: 'Segoe Print, cursive, sans-serif' }}>
                Thank you for visiting! I hope you enjoy the stories and<br />come back often to see what's new.
              </p>
              
              {/* Signature with paw print */}
              <div className="flex justify-center items-center">
                <div className="text-center ml-8">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="text-4xl text-blue-800 font-bold" style={{ fontFamily: 'Brush Script MT, cursive, sans-serif' }}>
                      Grandpa John
                    </div>
                    {/* Buddy's paw print using uploaded image */}
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Paw-print.svg/256px-Paw-print.svg.png?20110605041351" 
                      alt="Buddy's paw print"
                      className="w-8 h-8 ml-2"
                      style={{ transform: 'rotate(-15deg)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-amber-800 mb-2">
              Privacy & Security Policy
            </CardTitle>
            <p className="text-amber-600">
              Grandpa John's Stories - A completely cookie-free experience
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Zero Cookies Section */}
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Cookie className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-green-800">Zero Cookies Promise</h2>
              </div>
              <p className="!text-green-700 !text-base !font-normal leading-relaxed">
                We are proud to operate a <strong>completely cookie-free website</strong>. 
                When you visit Grandpa John's Stories to read our stories, 
                no cookies are stored on your device. No tracking, no analytics, 
                no third-party cookies - just pure, uninterrupted storytelling.
              </p>
            </div>

            {/* No Tracking Section */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-800">No Tracking or Analytics</h2>
              </div>
              <p className="!text-blue-700 !text-base !font-normal leading-relaxed">
                We don't use Google Analytics, Facebook Pixel, or any other tracking tools. 
                Your reading habits, preferences, and browsing behavior remain completely private. 
                We believe in respecting your digital privacy while you enjoy our stories.
              </p>
            </div>

            {/* Data Collection Section */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-purple-800">What We Don't Collect</h2>
              </div>
              <div className="space-y-2">
                <p className="!text-purple-800 !text-base !font-normal leading-relaxed">• Personal information</p>
                <p className="!text-purple-800 !text-base !font-normal leading-relaxed">• Email addresses (no newsletter signups required)</p>
                <p className="!text-purple-800 !text-base !font-normal leading-relaxed">• IP addresses for tracking</p>
                <p className="!text-purple-800 !text-base !font-normal leading-relaxed">• Browsing history</p>
                <p className="!text-purple-800 !text-base !font-normal leading-relaxed">• Device fingerprints</p>
                <p className="!text-purple-800 !text-base !font-normal leading-relaxed">• Location data</p>
              </div>
            </div>

            {/* Admin Access Section */}
            <div className="bg-amber-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="h-6 w-6 text-amber-600" />
                <h2 className="text-xl font-semibold text-amber-800">Secure Admin Access</h2>
              </div>
              <p className="!text-amber-700 !text-base !font-normal leading-relaxed">
                Our content management system uses cookie-free authentication exclusively for 
                administrative purposes. Admin sessions are stored locally on authorized devices 
                only and never transmitted as cookies. This ensures secure content management 
                while maintaining our cookie-free promise to visitors.
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions About Our Privacy Policy?</h2>
              <p className="!text-gray-700 !text-base !font-normal leading-relaxed">
                If you have any questions about our cookie-free approach or privacy practices, 
                please feel free to contact us. We're always happy to discuss our commitment 
                to protecting your privacy while sharing Grandpa's wonderful stories.
              </p>
            </div>

            <div className="text-center pt-6">
              <p className="text-amber-600 italic">
                "Privacy is not about hiding something. It's about protecting everything that matters." 
                - Grandpa John's Stories Team
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <CookieFreeFooter />
    </div>
  );
};

export default Privacy;
