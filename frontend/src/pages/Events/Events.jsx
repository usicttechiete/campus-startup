import { useEffect, useState } from 'react';
import Loader from '../../components/Loader/Loader.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Button from '../../components/Button/Button.jsx';
import { fetchEvents } from '../../services/event.api.js';
import { useRole } from '../../context/RoleContext.jsx';

const CalendarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const gradients = [
  'from-primary/80 to-accent/60',
  'from-accent/80 to-primary/60',
  'from-success/80 to-primary/60',
  'from-primary/80 to-warning/60',
];

const Events = () => {
  const { role } = useRole();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents();
      setEvents(Array.isArray(data?.results) ? data.results : data || []);
    } catch (err) {
      setError(err.message || 'Unable to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    // Set mock data for demo
    setEvents([
      {
        id: 1,
        name: 'Smart India Hackathon',
        date_range: 'Dec 15 - 17, 2024',
        stages: [
          { key: 'registration', label: 'Registration', status: 'active' },
          { key: 'submission', label: 'Submission', status: 'pending' },
          { key: 'judging', label: 'Judging', status: 'pending' }
        ]
      },
      {
        id: 2,
        name: 'Workshop on AI',
        date_range: 'Dec 20, 2024',
        stages: [
          { key: 'registration', label: 'Registration', status: 'active' },
        ]
      },
      {
        id: 3,
        name: 'Startup Pitch Competition',
        date_range: 'Jan 5 - 6, 2025',
        stages: [
          { key: 'registration', label: 'Registration', status: 'active' },
          { key: 'pitching', label: 'Pitching', status: 'pending' },
          { key: 'finals', label: 'Finals', status: 'pending' }
        ]
      }
    ]);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Events</h1>
          <p className="text-xs text-text-muted">Discover hackathons & workshops</p>
        </div>
        {role === 'admin' && (
          <Button size="sm" variant="primary">
            <PlusIcon className="h-4 w-4" />
            Create
          </Button>
        )}
      </header>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader label="Loading events" />
        </div>
      ) : error ? (
        <div className="glass-card p-6 text-center">
          <p className="text-sm text-danger mb-3">{error}</p>
          <Button size="sm" variant="ghost" onClick={loadEvents}>
            Retry
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradients[index % gradients.length]} p-4 transition-all hover:scale-[1.02] active:scale-[0.98]`}
            >
              {/* Content */}
              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white leading-tight">{event.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-white/80">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <span>{event.date_range}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="border-white/20 text-white hover:bg-white/10 hover:border-white/40">
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </div>

                {/* Stages */}
                {event.stages && event.stages.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {event.stages.map((stage, stageIndex) => (
                      <div
                        key={stage.key || stageIndex}
                        className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1"
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${stage.status === 'active' ? 'bg-success animate-pulse' : 'bg-white/50'}`} />
                        <span className="text-[10px] font-medium text-white">{stage.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Decorative elements */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10 blur-xl" />
            </div>
          ))}

          {!events.length && !loading && (
            <div className="glass-card p-8 text-center">
              <div className="mb-3 text-4xl">🎉</div>
              <p className="text-sm text-text-secondary">No events available right now.</p>
              <p className="text-xs text-text-muted mt-1">Check back soon for exciting opportunities!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;
