import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import IconLibraryDisplay from '@/components/admin/IconLibraryDisplay';
import IconUploadForm from '@/components/admin/IconUploadForm';
import PreferredColorsTable from '@/components/admin/PreferredColorsTable';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AdminReference = () => {
  const { userRole, isLoading } = useUserRole();
  const scrollPositionRef = useRef<number>(0);

  // Preserve scroll position when component unmounts or tab changes
  useEffect(() => {
    const saveScrollPosition = () => {
      scrollPositionRef.current = window.scrollY;
    };

    const restoreScrollPosition = () => {
      if (scrollPositionRef.current > 0) {
        setTimeout(() => {
          window.scrollTo(0, scrollPositionRef.current);
        }, 100);
      }
    };

    // Save scroll position before page unload
    window.addEventListener('beforeunload', saveScrollPosition);
    
    // Save scroll position when tab becomes hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        saveScrollPosition();
      } else {
        restoreScrollPosition();
      }
    });

    // Restore scroll position when component mounts
    restoreScrollPosition();

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
      document.removeEventListener('visibilitychange', saveScrollPosition);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse bg-muted rounded h-64 w-full"></div>
    );
  }

  if (userRole !== 'admin') {
    return (
      <>
        <Helmet>
          <title>Access Denied - Admin Reference</title>
        </Helmet>
        <Alert className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Admin access required to view reference materials.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Reference - Icons & Resources</title>
        <meta name="description" content="Admin reference materials including icon library" />
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Admin Reference
          </h1>
          <p className="text-muted-foreground">
            Reference materials and resources for administration
          </p>
        </div>

        <PreferredColorsTable />
        
        <IconUploadForm />
        
        <IconLibraryDisplay />
      </div>
    </>
  );
};

export default AdminReference;