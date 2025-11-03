import { SuperBox } from '@/components/admin/SuperBox';

/**
 * Gpa's Test Page
 * 
 * Minimal test page for SuperBox component with no header or footer.
 * Used for testing SuperBox rendering with different story codes.
 */
const GpasTestPage = () => {
  return (
    <div style={{ 
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <SuperBox code="HOL-4TH" />
    </div>
  );
};

export default GpasTestPage;
