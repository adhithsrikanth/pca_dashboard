import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkflowLayout } from '@/components/layout/WorkflowLayout';
import { useBuild } from '@/contexts/BuildContext';
import { generateProjectPlan } from '@/services/api';
import { CarpentryProjectRequest } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export default function Generating() {
  const navigate = useNavigate();
  const { buildData, setProjectPlan } = useBuild();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const projectType = buildData.projectType
    ? buildData.projectType
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'project';

  useEffect(() => {
    const generatePlan = async () => {
      try {
        // Convert frontend buildData to backend request format
        const length = buildData.dimensions.length ? parseFloat(buildData.dimensions.length) : undefined;
        const width = buildData.dimensions.width ? parseFloat(buildData.dimensions.width) : undefined;
        
        const request: CarpentryProjectRequest = {
          projectType: buildData.projectType || buildData.jobDescription || 'Custom Project',
          ...(length && width ? {
            dimensions: {
              length,
              width,
              unit: 'ft',
            }
          } : {}),
          material: buildData.materialPreference || undefined,
          skillLevel: buildData.qualityLevel === 'premium' ? 'Advanced' : buildData.qualityLevel === 'standard' ? 'Intermediate' : undefined,
          additionalRequirements: buildData.jobDescription || undefined,
        };

        const plan = await generateProjectPlan(request);
        setProjectPlan(plan);
        navigate('/materials');
      } catch (err: any) {
        console.error('Error generating project plan:', err);
        setError(err.message || 'Failed to generate project plan');
        toast({
          title: 'Error',
          description: err.message || 'Failed to generate project plan. Please try again.',
          variant: 'destructive',
        });
        // Navigate back to review after a delay
        setTimeout(() => {
          navigate('/review');
        }, 3000);
      }
    };

    generatePlan();
  }, [buildData, setProjectPlan, navigate, toast]);

  return (
    <WorkflowLayout showProgress currentStep={3} totalSteps={3} stepLabel="Generating">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        {error ? (
          <>
            <div className="mb-6 h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
              <span className="text-destructive text-xl">✕</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Error generating plan
            </h2>
            <p className="mt-2 text-muted-foreground">
              {error}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Redirecting back to review...
            </p>
          </>
        ) : (
          <>
            <div className="mb-6 h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Building your {projectType}...
            </h2>
            <p className="mt-2 text-muted-foreground">
              Analyzing your project requirements and generating a detailed plan
            </p>
          </>
        )}
      </div>
    </WorkflowLayout>
  );
}
