import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
}

export function ProgressBar({ currentStep, totalSteps, label }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium text-foreground">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
      )}
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
