
export const getFilterButtonStyles = (isActive: boolean, variant: 'all' | 'published' | 'unpublished') => {
  const baseStyles = {
    fontFamily: 'system-ui, -apple-system, sans-serif !important',
    fontSize: '0.875rem !important',
    fontWeight: '500 !important',
    padding: '0.5rem 1rem !important',
    borderRadius: '0.375rem !important',
    border: '1px solid !important',
    cursor: 'pointer !important',
    transition: 'all 0.2s ease-in-out !important',
    display: 'inline-flex !important',
    alignItems: 'center !important',
    justifyContent: 'center !important',
    textDecoration: 'none !important',
    outline: 'none !important',
    minHeight: '2.5rem !important',
    minWidth: '5rem !important',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.2) !important'
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
        color: 'white !important',
        boxShadow: '0 6px 12px rgba(194,65,12,0.3), 0 3px 6px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.3) !important'
      };
    case 'published':
      return {
        ...baseStyles,
        background: 'linear-gradient(to bottom, #4ade80, #16a34a) !important',
        borderColor: '#166534 !important',
        color: 'white !important',
        boxShadow: '0 6px 12px rgba(22,101,52,0.3), 0 3px 6px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.3) !important'
      };
    case 'unpublished':
      return {
        ...baseStyles,
        background: 'linear-gradient(to bottom, #f87171, #dc2626) !important',
        borderColor: '#991b1b !important',
        color: 'white !important',
        boxShadow: '0 6px 12px rgba(127,29,29,0.3), 0 3px 6px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.3) !important'
      };
    default:
      return baseStyles;
  }
};
