import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface BackupStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  details?: string;
  fileCount?: number;
  totalSize?: string;
}

interface BackupProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: BackupStep[];
  currentStep: string;
  overallProgress: number;
}

const BackupProgressModal: React.FC<BackupProgressModalProps> = ({
  isOpen,
  onClose,
  steps,
  currentStep,
  overallProgress
}) => {
  const getStepIcon = (step: BackupStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepBadge = (step: BackupStep) => {
    switch (step.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Full System Backup
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} />
          </div>

          <div className="space-y-2">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-2 p-2 border rounded text-sm">
                <div className="mt-0.5">
                  {getStepIcon(step)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-xs truncate">{step.label}</h4>
                    {getStepBadge(step)}
                  </div>
                  {step.details && (
                    <p className="text-xs text-gray-600">{step.details}</p>
                  )}
                  {step.fileCount !== undefined && (
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>{step.fileCount} files</span>
                      {step.totalSize && <span>• {step.totalSize}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BackupProgressModal;