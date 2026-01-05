import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { useBuild } from '@/contexts/BuildContext';

export default function Entry() {
  const navigate = useNavigate();
  const { resetBuild } = useBuild();

  const handleStart = () => {
    resetBuild();
    navigate('/job-definition');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Turn your job into a materials list
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Describe what you're building and get a complete bill of materials in minutes.
          </p>
          <Button
            size="lg"
            className="mt-8 h-12 px-8 text-base"
            onClick={handleStart}
          >
            Start New Build
          </Button>
        </div>
      </main>
    </div>
  );
}
