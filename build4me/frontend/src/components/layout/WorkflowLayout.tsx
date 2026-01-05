import { ReactNode } from 'react';
import { Header } from './Header';
import { ProgressBar } from './ProgressBar';

interface WorkflowLayoutProps {
  children: ReactNode;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
  stepLabel?: string;
}

export function WorkflowLayout({
  children,
  showProgress = false,
  currentStep = 1,
  totalSteps = 3,
  stepLabel,
}: WorkflowLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
          {showProgress && (
            <div className="mb-8">
              <ProgressBar currentStep={currentStep} totalSteps={totalSteps} label={stepLabel} />
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
