import React, { useState } from 'react';
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
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StoryCodeField from "@/components/StoryCodeField";
import { FileText } from "lucide-react";

const SuperText = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [storyCode, setStoryCode] = useState('');
  const [category, setCategory] = useState('');

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

        {/* Desktop Layout: Centered Story Status with left/right content (hidden on tablets) */}
        <div className="hidden lg:block">
          <div className="flex items-start justify-center gap-4">
            {/* Left Side: Story Details */}
            <div className="flex-1 max-w-sm">
              <Card className="bg-white border-4 h-full" style={{ borderColor: '#22c55e' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-bold" style={{
                    color: '#22c55e !important',
                    fontSize: '24px !important',
                    lineHeight: '1.2',
                    fontWeight: '700 !important'
                  }}>
                    <FileText className="h-5 w-5" color="#22c55e" />
                    <span>Story Details</span>
                    <span className="ml-auto bg-amber-600 text-white px-2 py-1 rounded text-sm font-bold">
                      1a
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="story-code" className="text-base font-semibold">
                      Story / Webtext Code
                    </Label>
                    <StoryCodeField 
                      value={storyCode}
                      onChange={setStoryCode}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-base font-semibold">
                      Category
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
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
                </CardContent>
              </Card>
            </div>
            
            {/* Center: Story Status */}
            <div className="flex-shrink-0">
              <SuperTextStoryStatus />
            </div>
            
            {/* Right Side: Buttons */}
            <div className="flex-1 max-w-sm">
              <Card className="bg-white border-4 h-full" style={{ borderColor: '#dc2626' }}>
                <CardContent className="p-6 flex flex-col gap-4 items-center justify-center h-full">
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
                    <span className="text-center leading-tight">CANCEL ALL EDITS & CLEAR FORM</span>
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Tablet Layout: 2-column grid (hidden on desktop) */}
        <div className="block lg:hidden">
          <div className="grid grid-cols-2 gap-4">
            {/* First Row: Story Details in left, Story Status in right */}
            <div>
              <Card className="bg-white border-4 h-full" style={{ borderColor: '#22c55e' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-bold" style={{
                    color: '#22c55e',
                    fontSize: '24px',
                    lineHeight: '1.2',
                    fontWeight: 700
                  }}>
                    <FileText className="h-5 w-5" color="#22c55e" />
                    <span>Story Details</span>
                    <span className="ml-auto bg-amber-600 text-white px-2 py-1 rounded text-sm font-bold">
                      1a
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="story-code-tablet" className="text-base font-semibold">
                      Story / Webtext Code
                    </Label>
                    <StoryCodeField 
                      value={storyCode}
                      onChange={setStoryCode}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category-tablet" className="text-base font-semibold">
                      Category
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
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
                </CardContent>
              </Card>
            </div>
            
            <div>
              <SuperTextStoryStatus />
            </div>
            
            {/* Second Row: Buttons in left column, empty right column */}
            <div className="flex flex-col gap-4">
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
                <span className="text-center leading-tight">CANCEL ALL EDITS & CLEAR FORM</span>
              </button>
            </div>
            
            {/* Empty right column */}
            <div>
              {/* Future content */}
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