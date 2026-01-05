import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { WorkflowLayout } from '@/components/layout/WorkflowLayout';
import { useBuild } from '@/contexts/BuildContext';

export default function JobDefinition() {
  const navigate = useNavigate();
  const { buildData, updateBuildData } = useBuild();
  const [description, setDescription] = useState(buildData.jobDescription);

  const handleContinue = () => {
    updateBuildData({ jobDescription: description });
    navigate('/questions');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <WorkflowLayout showProgress currentStep={1} totalSteps={3} stepLabel="Job Definition">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            What are you building?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Describe your project in as much detail as you'd like.
          </p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="description" className="text-base font-medium">
            Project Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., 12x16 deck with cedar boards, pressure-treated framing, built-in bench seating"
            className="min-h-[160px] resize-none text-base"
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleContinue} disabled={!description.trim()}>
            Continue
          </Button>
        </div>
      </div>
    </WorkflowLayout>
  );
}
