
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Cookie, Eye, Lock, HardDrive } from "lucide-react";
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
                <span className="font-bold">Quality Content</span>: Many of these stories are written by me but all stories and other content are edited by me to be engaging, age-appropriate for grade school students, encouraging, and meaningful.
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
              
              {/* Signature */}
              <div className="text-center mt-3">
                <p className="text-4xl text-blue-900 font-bold italic" style={{ fontFamily: 'Kalam, "Comic Sans MS", "Apple Color Emoji", cursive' }}>
                  Grandpa John
                </p>
              </div>
            </div>
          </div>
          
          {/* Web-text code indicator */}
          <div style={{ 
            position: 'absolute',
            bottom: '8px',
            right: '12px',
            fontSize: '12px',
            color: '#333',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            opacity: 0.8,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '2px 4px',
            borderRadius: '3px'
          }}>
            SYS-P2Y
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-amber-800 mb-2">
              Privacy & Security Policy
            </CardTitle>
            <p className="text-amber-600">
              Grandpa John's Stories — A completely cookie-free experience
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
                no third-party cookies — just pure, uninterrupted storytelling.
              </p>
            </div>

            {/* Cloudflare Security Cookie */}
            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-semibold text-orange-800">Cloudflare Security Protection</h2>
              </div>
              <p className="!text-orange-700 !text-base !font-normal leading-relaxed mb-3">
                Our website hosting service (Supabase) uses Cloudflare for security protection. 
                Cloudflare may set a temporary security cookie called <code className="bg-orange-100 px-1 rounded">__cf_bm</code> 
                to protect against malicious bot traffic and ensure the website remains safe and accessible.
              </p>
              <p className="!text-orange-700 !text-base !font-normal leading-relaxed">
                This cookie is <strong>essential for security</strong>, expires within 30 minutes, 
                contains no personal information, and is managed entirely by Cloudflare's security systems. 
                It helps keep our stories safe for children to enjoy.
              </p>
            </div>

            {/* Local Storage Section */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <HardDrive className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-indigo-800">Local Browser Storage</h2>
              </div>
              <p className="!text-indigo-700 !text-base !font-normal leading-relaxed mb-3">
                To improve your reading experience, we store a small piece of information called 
                <code className="bg-indigo-100 px-1 rounded">currentStoryPath</code> in your browser's 
                session storage. This helps you easily return to the story you were reading through 
                our "Current Story" menu option.
              </p>
              <p className="!text-indigo-700 !text-base !font-normal leading-relaxed">
                This information stays only in your browser, is never sent to our servers, 
                and automatically disappears when you close your browser tab. It contains no personal 
                information — just the path to the story you were reading.
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
              <p className="!text-amber-700 !text-base !font-normal leading-relaxed mb-3">
                Our content management system uses cookie-free authentication exclusively for 
                administrative purposes. Admin sessions are stored locally on authorized devices 
                only and never transmitted as cookies. This ensures secure content management 
                while maintaining our cookie-free promise to visitors.
              </p>
              <p className="!text-amber-700 !text-base !font-normal leading-relaxed">
                Additionally, administrative access requires a special external authentication key 
                that is never stored on the website itself. This external key system provides an 
                extra layer of security, ensuring that only authorized personnel can access the 
                site's administrative functions while keeping all visitor interactions completely 
                secure and private.
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions About Our Privacy Policy?</h2>
              <p className="!text-gray-700 !text-base !font-normal leading-relaxed">
                If you have any questions about our cookie-free approach or privacy practices, 
                please feel free to contact us by leaving a comment on our <a href="/comments" className="text-blue-600 hover:text-blue-800 underline">Comment Page</a>. We're always happy to discuss our commitment 
                to protecting your privacy while sharing Grandpa's stories.
              </p>
            </div>

            <div className="text-center pt-6">
              <p className="text-amber-600 italic">
                "Privacy is not about hiding something.<br />It's about protecting everything that matters."
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
