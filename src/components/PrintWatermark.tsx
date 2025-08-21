import React from 'react';

interface PrintWatermarkProps {
  show: boolean;
}

const PrintWatermark: React.FC<PrintWatermarkProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="print-watermark">
      <img 
        src="/lovable-uploads/ffc99cb6-290e-40fe-96a0-070386b466e0.png" 
        alt="Do Not Copy"
        className="print-watermark-image"
      />
    </div>
  );
};

export default PrintWatermark;