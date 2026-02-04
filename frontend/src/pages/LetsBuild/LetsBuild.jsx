import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button.jsx';
import Card from '../../components/Card/Card.jsx';

const RocketIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const LetsBuild = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="text-center py-10 animate-scale-in">
        {/* Decorative glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
            <RocketIcon className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-xl font-bold text-text-primary">Let&apos;s Build Together</h1>
          <p className="mt-2 text-sm text-text-muted max-w-[280px] mx-auto leading-relaxed">
            Team collaboration spaces are coming soon. Find teammates, build projects, and launch together.
          </p>

          <div className="mt-6 space-y-3">
            <Button variant="primary" onClick={() => navigate('/')} className="w-full">
              Explore Ideas
            </Button>
            <Button variant="ghost" onClick={() => navigate('/events')} className="w-full">
              Join Events
            </Button>
          </div>

          {/* Coming soon badge */}
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-soft border border-accent/20">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-accent font-medium">Coming Soon</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LetsBuild;
