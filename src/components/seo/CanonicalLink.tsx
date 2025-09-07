import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const CanonicalLink = () => {
  const location = useLocation();
  const canonicalUrl = `https://gpaskids.com${location.pathname}${location.search}`;

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
    </Helmet>
  );
};

export default CanonicalLink;