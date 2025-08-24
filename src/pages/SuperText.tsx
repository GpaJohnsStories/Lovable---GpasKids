import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SecureAdminRoute from '@/components/admin/SecureAdminRoute';
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

const SuperText = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-800 mb-8">
          Super Text Manager
        </h1>
        
        {/* Save & Clear Form Button Row */}
        <div className="flex justify-start mb-8">
          <button
            onClick={handleSaveAndClear}
            className="px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2"
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
        </div>
        
        {/* Content will be added in future steps */}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-center" style={{ color: '#dc2626' }}>
              Confirm Save & Clear
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-center font-bold" style={{ color: '#000000' }}>
              Are you <span style={{ color: '#dc2626' }}>SURE</span> you want to <span style={{ color: '#dc2626' }}>SAVE</span> this file and <span style={{ color: '#dc2626' }}>CLEAR</span> this page for a new form?
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