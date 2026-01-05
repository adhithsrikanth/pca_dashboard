import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WorkflowLayout } from '@/components/layout/WorkflowLayout';
import { useBuild, BuildData } from '@/contexts/BuildContext';

interface Question {
  id: keyof BuildData | 'dimensions';
  title: string;
  description?: string;
  type: 'select' | 'dimensions' | 'toggle';
  options?: { value: string; label: string }[];
}

const questions: Question[] = [
  {
    id: 'projectType',
    title: 'What type of project is this?',
    type: 'select',
    options: [
      { value: 'deck', label: 'Deck' },
      { value: 'framing', label: 'Framing' },
      { value: 'trim', label: 'Trim Work' },
      { value: 'partition', label: 'Partition Wall' },
      { value: 'ceiling', label: 'Ceiling' },
      { value: 'shelving', label: 'Shelving / Storage' },
      { value: 'fence', label: 'Fence' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'dimensions',
    title: 'What are the approximate dimensions?',
    description: 'Enter length and width in feet',
    type: 'dimensions',
  },
  {
    id: 'materialPreference',
    title: 'What is your primary material preference?',
    type: 'select',
    options: [
      { value: 'pressure-treated', label: 'Pressure-Treated Lumber' },
      { value: 'cedar', label: 'Cedar' },
      { value: 'redwood', label: 'Redwood' },
      { value: 'composite', label: 'Composite' },
      { value: 'pine', label: 'Pine' },
      { value: 'oak', label: 'Oak' },
      { value: 'plywood', label: 'Plywood' },
      { value: 'mdf', label: 'MDF' },
    ],
  },
  {
    id: 'location',
    title: 'Where will this be installed?',
    type: 'toggle',
    options: [
      { value: 'indoor', label: 'Indoor' },
      { value: 'outdoor', label: 'Outdoor' },
    ],
  },
  {
    id: 'qualityLevel',
    title: 'What quality level are you targeting?',
    description: 'This affects material grades and hardware',
    type: 'toggle',
    options: [
      { value: 'standard', label: 'Standard' },
      { value: 'premium', label: 'Premium' },
    ],
  },
];

export default function Questions() {
  const navigate = useNavigate();
  const { buildData, updateBuildData, currentQuestionIndex, setCurrentQuestionIndex } = useBuild();

  const question = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressStep = 1 + ((currentQuestionIndex + 1) / totalQuestions);

  const getCurrentValue = () => {
    if (question.id === 'dimensions') {
      return buildData.dimensions;
    }
    return buildData[question.id as keyof BuildData];
  };

  const handleSelect = (value: string) => {
    if (question.id === 'location') {
      updateBuildData({ location: value as 'indoor' | 'outdoor' });
    } else if (question.id === 'qualityLevel') {
      updateBuildData({ qualityLevel: value as 'standard' | 'premium' });
    } else {
      updateBuildData({ [question.id]: value });
    }
  };

  const handleDimensionChange = (field: 'length' | 'width', value: string) => {
    updateBuildData({
      dimensions: { ...buildData.dimensions, [field]: value },
    });
  };

  const canContinue = () => {
    const value = getCurrentValue();
    if (question.id === 'dimensions') {
      const dims = value as { length: string; width: string };
      return dims.length.trim() !== '' && dims.width.trim() !== '';
    }
    return value !== '';
  };

  const handleContinue = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate('/review');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      navigate('/job-definition');
    }
  };

  return (
    <WorkflowLayout
      showProgress
      currentStep={Math.round(progressStep)}
      totalSteps={3}
      stepLabel="Project Details"
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {question.title}
          </h1>
          {question.description && (
            <p className="mt-2 text-muted-foreground">{question.description}</p>
          )}
        </div>

        <div className="space-y-4">
          {question.type === 'select' && (
            <Select
              value={getCurrentValue() as string}
              onValueChange={handleSelect}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {question.type === 'dimensions' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length">Length (ft)</Label>
                <Input
                  id="length"
                  type="number"
                  value={buildData.dimensions.length}
                  onChange={(e) => handleDimensionChange('length', e.target.value)}
                  placeholder="e.g., 12"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width (ft)</Label>
                <Input
                  id="width"
                  type="number"
                  value={buildData.dimensions.width}
                  onChange={(e) => handleDimensionChange('width', e.target.value)}
                  placeholder="e.g., 16"
                  className="h-12 text-base"
                />
              </div>
            </div>
          )}

          {question.type === 'toggle' && (
            <div className="flex gap-3">
              {question.options?.map((option) => (
                <Button
                  key={option.value}
                  variant={getCurrentValue() === option.value ? 'default' : 'outline'}
                  className="h-12 flex-1 text-base"
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {totalQuestions} · You can edit responses later
        </p>

        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleContinue} disabled={!canContinue()}>
            Continue
          </Button>
        </div>
      </div>
    </WorkflowLayout>
  );
}
