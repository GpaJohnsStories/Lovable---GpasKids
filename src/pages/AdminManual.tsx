import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/admin/AdminLayout';
import SysWelWebTextBox from '@/components/templates/SysWelWebTextBox';  
import SysWe2WebTextBox from '@/components/templates/SysWe2WebTextBox';

const AdminManual: React.FC = () => {
  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Manual - GpasKids.com Administration Guide</title>
        <meta name="description" content="Comprehensive administration manual for GpasKids.com with templates, standards, and procedures." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome & Overview */}
        <SysWelWebTextBox 
          code="ADM-MAA"
          title="GpasKids.com Admin Manual" 
          id="welcome-section"
        />
        
        {/* Text Box System Overview */}
        <SysWe2WebTextBox 
          code="ADM-MAB"
          title="WebText Box System Overview"
          id="textbox-overview"
        />
        
        {/* SYS-WEL Text Box Defaults */}
        <SysWelWebTextBox 
          code="ADM-MAC"
          title="SYS-WEL Text Box Standards"
          id="syswel-standards"
        />
        
        {/* SYS-WE2 Text Box Defaults */}
        <SysWe2WebTextBox 
          code="ADM-MAD"
          title="SYS-WE2 Text Box Standards" 
          id="syswe2-standards"
        />
        
        {/* Content Creation Guidelines */}
        <SysWelWebTextBox 
          code="ADM-MAE"
          title="Content Creation Guidelines"
          id="content-guidelines"
        />
        
        {/* Code Naming Conventions */}
        <SysWe2WebTextBox 
          code="ADM-MAF"
          title="Story Code Naming Conventions"
          id="code-conventions"
        />
        
        {/* Security Guidelines for Child Safety */}
        <SysWelWebTextBox 
          code="ADM-MAG"
          title="Child Safety & Security Protocols"
          id="safety-protocols"
        />
        
        {/* Template Reference */}
        <SysWe2WebTextBox 
          code="ADM-MAH"
          title="Quick Template Reference"
          id="template-reference"
        />
        
        {/* Emergency Procedures */}
        <SysWelWebTextBox 
          code="ADM-MAI"
          title="Emergency Response Procedures"
          id="emergency-procedures"
        />
        
        {/* Maintenance Schedules */}
        <SysWe2WebTextBox 
          code="ADM-MAJ"
          title="Regular Maintenance Schedule"
          id="maintenance-schedule"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminManual;