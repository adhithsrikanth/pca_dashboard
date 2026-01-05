import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
        <Link to="/" className="text-xl font-semibold tracking-tight text-foreground">
          Build4Me
        </Link>
      </div>
    </header>
  );
}
