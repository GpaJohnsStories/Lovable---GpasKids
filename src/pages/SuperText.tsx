import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SecureAdminRoute from '@/components/admin/SecureAdminRoute';
import SuperTextStoryStatus from '@/components/SuperTextStoryStatus';
import './SuperText.css';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';

const SuperText = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [storyCode, setStoryCode] = useState('');
  const [category, setCategory] = useState('');
  const [foundStoryTitle, setFoundStoryTitle] = useState('');
  const [foundStory, setFoundStory] = useState<any>(null);
  const [noStoryFound, setNoStoryFound] = useState(false);
  
  const { lookupStoryByCode } = useStoryCodeLookup();
  
  const allowedCategories = ["Fun", "Life", "North Pole", "World Changers", "WebText", "BioText"];

  // Debounced lookup function
  const debouncedLookup = useCallback(async (code: string) => {
    console.log('🔧 Debounced lookup called with:', code);
    
    if (!code.trim() || code.trim().length < 3) {
      setFoundStoryTitle('');
      setFoundStory(null);
      setCategory('');
      setNoStoryFound(false);
      return;
    }

    const result = await lookupStoryByCode(code.trim(), true);
    console.log('🔧 Lookup result:', result);
    
    if (result.found && result.story) {
      setFoundStoryTitle(result.story.title);
      setFoundStory(result.story);
      // Only set category if it's in the allowed list
      if (allowedCategories.includes(result.story.category)) {
        setCategory(result.story.category);
      } else {
        setCategory('');
      }
      setNoStoryFound(false);
    } else if (!result.error) {
      setFoundStoryTitle('');
      setFoundStory(null);
      setCategory('');
      setNoStoryFound(true);
    }
  }, [lookupStoryByCode]);

  // Debounce timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (storyCode.trim()) {
        debouncedLookup(storyCode);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [storyCode, debouncedLookup]);

  const handleSaveAndClear = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmYes = () => {
    // TODO: Save functionality will be implemented later
    console.log('Save and clear confirmed - functionality to be implemented');
    
    // Close dialog
    setShowConfirmDialog(false);
    
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Dispatch custom event for form clearing (for future form implementation)
    window.dispatchEvent(new CustomEvent('supertext:clear-form'));
  };

  const handleConfirmNo = () => {
    setShowConfirmDialog(false);
    // Keep current scroll position
  };

  // Handle text action (Update/Add) decisions
  const handleTextActionYes = () => {
    if (foundStory) {
      console.log('Update text confirmed for story:', foundStory.title);
      // TODO: Implement update functionality
    } else {
      console.log('Add new text confirmed for code:', storyCode);
      // TODO: Implement add functionality
    }
  };

  const handleTextActionNo = () => {
    if (foundStory) {
      console.log('Update text declined for story:', foundStory.title);
    } else {
      console.log('Add new text declined for code:', storyCode);
    }
  };

  return (
    <SecureAdminRoute>
      <Helmet>
        <title>Super Text Manager - Admin</title>
      </Helmet>
      
      <div className="container mx-auto px-4 pb-8 -mt-[30px]">
        {/* Title */}
        <h1 className="text-3xl font-bold text-amber-800 mb-6 pl-2">
          Super Text Manager
        </h1>

        {/* Action Buttons Bar - Full Width Top */}
        <div className="w-full mb-6">
          <div className="flex justify-center items-center gap-6">
            <button
              onClick={handleSaveAndClear}
              className="w-80 h-16 px-8 py-4 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 flex items-center justify-center"
              style={{
                backgroundColor: '#228B22', // Forest Green
                color: '#FFD700', // Golden Yellow
                borderColor: '#1F7A1F', // Darker green for border
                boxShadow: '0 6px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)';
              }}
            >
              Save & Clear Form
            </button>
            
            <button
              onClick={() => {
                // TODO: Cancel functionality will be implemented later
                console.log('Cancel all edits - functionality to be implemented');
              }}
              className="w-80 h-16 px-8 py-4 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 flex items-center justify-center"
              style={{
                backgroundColor: '#dc2626', // Red Primary
                color: '#ffffff', // Bold White
                borderColor: '#b91c1c', // Darker red for border
                boxShadow: '0 6px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)';
              }}
            >
              <span className="text-center leading-tight">Cancel All Edits<br />& Clear Form</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout: Two Columns */}
        <div className="block overflow-x-auto pt-4 pl-4">
          <div className="flex items-start justify-center gap-6 w-full max-w-7xl mx-auto">
            {/* Left Side: Story Details */}
            <div className="flex-1">
              <Card className="bg-white border-4 h-fit relative" style={{ borderColor: '#22c55e' }}>
                {/* Blue dot with "1" in top left corner */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                  1
                </div>
                
                {/* Text Action Indicator in top right corner INSIDE the box */}
                {storyCode.trim().length >= 3 && (foundStory || noStoryFound) && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="flex flex-col items-end gap-2">
                      {/* Main Action Message Pill */}
                      <div
                        className="px-4 py-2 rounded-full font-bold text-lg border-2"
                        style={{
                          backgroundColor: foundStory ? '#dc2626' : '#228B22', // Red if update, Green if add
                          color: '#FFD700', // Golden Yellow text
                          borderColor: foundStory ? '#b91c1c' : '#1F7A1F', // Darker border
                          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                        }}
                      >
                        {foundStory ? 'Update This Text?' : 'Add New Text?'}
                      </div>
                      
                      {/* Yes/No Buttons - No on left, Yes on right */}
                      <div className="flex gap-2">
                        {/* No Button (left) */}
                        <button
                          onClick={handleTextActionNo}
                          className="px-4 py-2 rounded-full font-bold text-lg border-2 hover:scale-105 transition-transform"
                          style={{
                            backgroundColor: '#dc2626', // Red
                            color: '#ffffff', // White text
                            borderColor: '#b91c1c',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                          }}
                        >
                          No
                        </button>
                        
                        {/* Yes Button (right) */}
                        <button
                          onClick={handleTextActionYes}
                          className="px-4 py-2 rounded-full font-bold text-lg border-2 hover:scale-105 transition-transform"
                          style={{
                            backgroundColor: '#228B22', // Green
                            color: '#ffffff', // White text
                            borderColor: '#1F7A1F',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                          }}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle 
                    className="flex items-center gap-2 font-bold" 
                    style={{
                      color: '#22c55e',
                      fontSize: '24px',
                      lineHeight: '1.2',
                      fontWeight: '700'
                    }}
                  >
                    <FileText className="h-5 w-5" style={{ color: '#22c55e' }} />
                    <span style={{ color: '#22c55e' }}>Story Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="story-code" className="font-bold text-xl text-orange-accent block">
                          Current or New<br />Unique Code:
                        </Label>
                        <div className="w-1/2">
                           <Input
                             id="story-code"
                             value={storyCode}
                             onChange={(e) => setStoryCode(e.target.value)}
                             placeholder="Code"
                             className="w-full px-3 py-2 text-base border rounded-md border-orange-accent border-2"
                             style={{ fontFamily: 'Arial, sans-serif', fontSize: '21px', fontWeight: 'bold', color: '#000000' }}
                             autoComplete="off"
                           />
                        </div>
                      </div>
                      
                      {/* Story Title Display Box */}
                      {foundStoryTitle && (
                        <div className="w-full mt-4">
                          <div className="w-full p-4 border-2 rounded-md bg-blue-50" style={{ borderColor: '#22c55e' }}>
                            <div className="text-sm font-bold text-gray-600 mb-2">Found Story Title:</div>
                            <div className="font-bold text-lg" style={{ color: '#22c55e', fontSize: '21px' }}>
                              {foundStoryTitle}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* No Story Found Message */}
                      {noStoryFound && storyCode.trim().length >= 3 && (
                        <div className="w-full mt-4">
                          <div className="w-full p-4 border-2 rounded-md bg-gray-50" style={{ borderColor: '#6b7280' }}>
                            <div className="text-sm font-bold text-gray-600 mb-2">Lookup Result:</div>
                            <div className="font-bold text-lg text-gray-600" style={{ fontSize: '21px' }}>
                              No story found for this code
                            </div>
                          </div>
                        </div>
                      )}
                  
                  <div className="space-y-2">
                    <div className="w-1/2">
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-full border-2 font-bold text-xl" style={{ borderColor: '#8B4513', color: '#FF8C00' }}>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                      <SelectContent className="bg-white z-[100]">
                        <SelectItem value="Fun">Fun</SelectItem>
                        <SelectItem value="Life">Life</SelectItem>
                        <SelectItem value="North Pole">North Pole</SelectItem>
                        <SelectItem value="World Changers">World Changers</SelectItem>
                        <SelectItem value="WebText">WebText</SelectItem>
                        <SelectItem value="BioText">BioText</SelectItem>
                      </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Side: Story Status */}
            <div className="flex-1">
              <SuperTextStoryStatus story={foundStory} />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-center" style={{ color: '#dc2626' }}>
              Confirm Save & Clear
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-center font-bold" style={{ color: '#000000' }}>
              Are you <span style={{ color: '#dc2626' }}>SURE</span> you want to <span style={{ color: '#dc2626' }}>SAVE</span> this file and <span style={{ color: '#dc2626' }}>CLEAR</span> this page for new text?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center gap-4 mt-6">
            <AlertDialogCancel 
              onClick={handleConfirmNo}
              className="supertext-no-btn rounded-full px-8 py-3 text-lg font-bold border-2"
            >
              NO
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmYes}
              className="supertext-yes-btn rounded-full px-8 py-3 text-lg font-bold border-2"
            >
              YES
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SecureAdminRoute>
  );
};

export default SuperText;