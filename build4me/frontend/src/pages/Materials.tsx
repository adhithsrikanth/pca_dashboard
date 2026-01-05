import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WorkflowLayout } from '@/components/layout/WorkflowLayout';
import { useBuild } from '@/contexts/BuildContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, AlertCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Materials() {
  const navigate = useNavigate();
  const { buildData, projectPlan, resetBuild } = useBuild();

  const handleStartNew = () => {
    resetBuild();
    navigate('/');
  };

  if (!projectPlan) {
    return (
      <WorkflowLayout showProgress={false}>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              No Project Plan Available
            </h1>
            <p className="mt-2 text-muted-foreground">
              Please generate a project plan first.
            </p>
          </div>
          <Button onClick={() => navigate('/review')}>Go to Review</Button>
        </div>
      </WorkflowLayout>
    );
  }

  return (
    <WorkflowLayout showProgress={false}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {projectPlan.projectName}
          </h1>
          <p className="mt-2 text-muted-foreground">{projectPlan.overview}</p>
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <span>Estimated Time: {projectPlan.estimatedTotalTime}</span>
            <span>•</span>
            <span>
              Total Cost: {projectPlan.currency || 'USD'} ${projectPlan.estimatedTotalCost.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Parts List */}
        <Card>
          <CardHeader>
            <CardTitle>Materials & Parts</CardTitle>
            <CardDescription>
              Complete list of materials needed for your project
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {projectPlan.parts.map((part, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{part.name}</h3>
                        <Badge variant="secondary">Qty: {part.quantity}</Badge>
                      </div>
                      {part.description && (
                        <p className="text-sm text-muted-foreground">{part.description}</p>
                      )}
                      {part.link && (
                        <a
                          href={part.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          View Product <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {part.alternatives && part.alternatives.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Alternatives:</p>
                          {part.alternatives.map((alt, altIndex) => (
                            <div key={altIndex} className="text-xs text-muted-foreground">
                              • {alt.name} (Qty: {alt.quantity}) - ${alt.price.toFixed(2)}
                              {alt.link && (
                                <a
                                  href={alt.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 text-primary hover:underline"
                                >
                                  <ExternalLink className="inline h-3 w-3" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">
                        ${(part.price * part.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${part.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="border-t-2 border-primary bg-muted/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-foreground">Estimated Total</p>
                <p className="text-2xl font-bold text-primary">
                  {projectPlan.currency || 'USD'} ${projectPlan.estimatedTotalCost.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        {projectPlan.steps && projectPlan.steps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Instructions</CardTitle>
              <CardDescription>
                Follow these steps to complete your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {projectPlan.steps.map((step) => (
                  <AccordionItem key={step.stepNumber} value={`step-${step.stepNumber}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3 text-left">
                        <Badge variant="outline" className="shrink-0">
                          Step {step.stepNumber}
                        </Badge>
                        <span className="font-medium">{step.title}</span>
                        {step.estimatedTime && (
                          <Badge variant="secondary" className="ml-auto">
                            {step.estimatedTime}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        <p className="text-sm text-foreground">{step.description}</p>
                        {step.tools && step.tools.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Tools:</p>
                            <div className="flex flex-wrap gap-1">
                              {step.tools.map((tool, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {step.materials && step.materials.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Materials:</p>
                            <div className="flex flex-wrap gap-1">
                              {step.materials.map((material, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {step.warnings && step.warnings.length > 0 && (
                          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-2">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-destructive mb-1">Warnings:</p>
                                <ul className="text-xs text-destructive space-y-1">
                                  {step.warnings.map((warning, idx) => (
                                    <li key={idx}>• {warning}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Tools */}
        {projectPlan.tools && projectPlan.tools.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Required Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {projectPlan.tools.map((tool, index) => (
                  <Badge key={index} variant="secondary">
                    {tool}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        {projectPlan.tips && projectPlan.tips.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tips & Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {projectPlan.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" onClick={() => navigate('/review')}>
            Back to Review
          </Button>
          <Button size="lg" onClick={handleStartNew}>
            Start New Build
          </Button>
        </div>
      </div>
    </WorkflowLayout>
  );
}
