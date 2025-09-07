import { useEffect } from 'react';

const HostRedirect = () => {
  useEffect(() => {
    const currentHost = window.location.hostname;
    
    // If user is on www.gpaskids.com, redirect to gpaskids.com
    if (currentHost === 'www.gpaskids.com') {
      const newUrl = `https://gpaskids.com${window.location.pathname}${window.location.search}${window.location.hash}`;
      window.location.replace(newUrl);
    }
  }, []);

  return null;
};

export default HostRedirect;