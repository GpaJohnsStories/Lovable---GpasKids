
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Cookie, Eye, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center space-x-2 text-amber-700">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Stories</span>
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-amber-800 mb-2">
              Privacy & Security Policy
            </CardTitle>
            <p className="text-amber-600">
              Grandpa's Story Corner - A completely cookie-free experience
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Zero Cookies Section */}
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Cookie className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-green-800">Zero Cookies Promise</h2>
              </div>
              <p className="text-green-700 leading-relaxed">
                We are proud to operate a <strong>completely cookie-free website</strong>. 
                When you visit Grandpa's Story Corner to read our heartwarming stories, 
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
              <p className="text-blue-700 leading-relaxed">
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
              <ul className="text-purple-700 space-y-2">
                <li>• Personal information</li>
                <li>• Email addresses (no newsletter signups required)</li>
                <li>• IP addresses for tracking</li>
                <li>• Browsing history</li>
                <li>• Device fingerprints</li>
                <li>• Location data</li>
              </ul>
            </div>

            {/* Admin Access Section */}
            <div className="bg-amber-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="h-6 w-6 text-amber-600" />
                <h2 className="text-xl font-semibold text-amber-800">Secure Admin Access</h2>
              </div>
              <p className="text-amber-700 leading-relaxed">
                Our content management system uses cookie-free authentication exclusively for 
                administrative purposes. Admin sessions are stored locally on authorized devices 
                only and never transmitted as cookies. This ensures secure content management 
                while maintaining our cookie-free promise to visitors.
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions About Our Privacy Policy?</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about our cookie-free approach or privacy practices, 
                please feel free to contact us. We're always happy to discuss our commitment 
                to protecting your privacy while sharing Grandpa's wonderful stories.
              </p>
            </div>

            <div className="text-center pt-6">
              <p className="text-amber-600 italic">
                "Privacy is not about hiding something. It's about protecting everything that matters." 
                - Grandpa's Story Corner Team
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
