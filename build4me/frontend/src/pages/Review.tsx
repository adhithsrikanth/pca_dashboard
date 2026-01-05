import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WorkflowLayout } from '@/components/layout/WorkflowLayout';
import { useBuild } from '@/contexts/BuildContext';
import { Pencil } from 'lucide-react';

const formatLabel = (key: string): string => {
  const labels: Record<string, string> = {
    projectType: 'Project Type',
    dimensions: 'Dimensions',
    materialPreference: 'Material',
    location: 'Location',
    qualityLevel: 'Quality Level',
  };
  return labels[key] || key;
};

const formatValue = (key: string, value: unknown): string => {
  if (key === 'dimensions') {
    const dims = value as { length: string; width: string };
    return `${dims.length} × ${dims.width} ft`;
  }
  if (typeof value === 'string') {
    return value
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return String(value);
};

export default function Review() {
  const navigate = useNavigate();
  const { buildData, setCurrentQuestionIndex } = useBuild();

  const summaryItems = [
    { key: 'jobDescription', label: 'Job Description', value: buildData.jobDescription },
    { key: 'projectType', label: 'Project Type', value: buildData.projectType },
    { key: 'dimensions', label: 'Dimensions', value: buildData.dimensions },
    { key: 'materialPreference', label: 'Material', value: buildData.materialPreference },
    { key: 'location', label: 'Location', value: buildData.location },
    { key: 'qualityLevel', label: 'Quality Level', value: buildData.qualityLevel },
  ];

  const questionIndexMap: Record<string, number> = {
    projectType: 0,
    dimensions: 1,
    materialPreference: 2,
    location: 3,
    qualityLevel: 4,
  };

  const handleEdit = (key: string) => {
    if (key === 'jobDescription') {
      navigate('/job-definition');
    } else {
      setCurrentQuestionIndex(questionIndexMap[key] ?? 0);
      navigate('/questions');
    }
  };

  const handleGenerate = () => {
    navigate('/generating');
  };

  return (
    <WorkflowLayout showProgress currentStep={3} totalSteps={3} stepLabel="Review">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Review your project
          </h1>
          <p className="mt-2 text-muted-foreground">
            Confirm the details below before generating your materials list.
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="divide-y divide-border p-0">
            {summaryItems.map((item) => (
              <div
                key={item.key}
                className="flex items-start justify-between gap-4 px-6 py-4"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-base text-foreground">
                    {formatValue(item.key, item.value)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                  onClick={() => handleEdit(item.key)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="ml-2">Edit</span>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" onClick={() => navigate('/questions')}>
            Back
          </Button>
          <Button size="lg" onClick={handleGenerate}>
            Generate Materials List
          </Button>
        </div>
      </div>
    </WorkflowLayout>
  );
}
