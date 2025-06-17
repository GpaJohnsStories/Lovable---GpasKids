
export const getFilterButtonStyles = (isActive: boolean, variant: 'all' | 'published' | 'unpublished') => {
  const baseStyles = {
    fontFamily: 'system-ui, -apple-system, sans-serif !important',
    fontSize: '0.875rem !important',
    fontWeight: '500 !important',
    padding: '0.5rem 0.75rem !important',
    borderRadius: '0.375rem !important',
    border: '1px solid !important',
    cursor: 'pointer !important',
    transition: 'all 0.2s !important',
    display: 'inline-flex !important',
    alignItems: 'center !important',
    justifyContent: 'center !important',
    textDecoration: 'none !important',
    outline: 'none !important',
    boxShadow: 'none !important'
  };

  if (!isActive) {
    return {
      ...baseStyles,
      background: 'linear-gradient(to bottom, #ffffff, #f9fafb) !important',
      borderColor: '#d1d5db !important',
      color: '#374151 !important'
    };
  }

  switch (variant) {
    case 'all':
      return {
        ...baseStyles,
        background: 'linear-gradient(to bottom, #fb923c, #ea580c) !important',
        borderColor: '#c2410c !important',
        color: 'white !important'
      };
    case 'published':
      return {
        ...baseStyles,
        background: 'linear-gradient(to bottom, #4ade80, #16a34a) !important',
        borderColor: '#166534 !important',
        color: 'white !important'
      };
    case 'unpublished':
      return {
        ...baseStyles,
        background: 'linear-gradient(to bottom, #f87171, #dc2626) !important',
        borderColor: '#991b1b !important',
        color: 'white !important'
      };
    default:
      return baseStyles;
  }
};
