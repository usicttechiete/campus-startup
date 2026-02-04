import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../../services/event.api.js';
import { fetchInternships } from '../../services/internship.api.js';

// Icons
const BriefcaseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const RocketIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const ChevronIcon = ({ className, direction = 'right' }) => (
  <svg className={`${className} ${direction === 'left' ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// Card component for suggestions
const SuggestionCard = ({ icon: Icon, title, subtitle, gradient, actionLabel, onClick }) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center gap-2 min-w-[100px] p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all active:scale-95"
  >
    <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="text-center">
      <p className="text-xs font-semibold text-gray-900 line-clamp-1 max-w-[90px]">{title}</p>
      <p className="text-[10px] text-gray-500 line-clamp-1">{subtitle}</p>
    </div>
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
      {actionLabel}
    </span>
  </button>
);

// Horizontal scroll section component
const ScrollSection = ({ title, subtitle, items, seeAllPath }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState({ left: false, right: true });

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowArrows({
      left: scrollLeft > 10,
      right: scrollLeft < scrollWidth - clientWidth - 10
    });
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  if (!items.length) return null;

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        </div>
        {seeAllPath && (
          <button onClick={() => navigate(seeAllPath)} className="text-xs text-blue-600 font-medium hover:underline">
            See all
          </button>
        )}
      </div>
      {subtitle && <p className="text-xs text-gray-500 -mt-2">{subtitle}</p>}

      {/* Scrollable container */}
      <div className="relative -mx-4">
        {showArrows.left && (
          <button onClick={() => scroll('left')} className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <ChevronIcon direction="left" className="w-4 h-4 text-gray-600" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => (
            <SuggestionCard key={item.id || index} {...item} />
          ))}
        </div>

        {showArrows.right && items.length > 3 && (
          <button onClick={() => scroll('right')} className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <ChevronIcon className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>
    </section>
  );
};

const HomeQuickScroll = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [evRes, intRes] = await Promise.all([fetchEvents(), fetchInternships()]);
        if (!mounted) return;
        setEvents(Array.isArray(evRes?.results) ? evRes.results : evRes || []);
        setInternships(Array.isArray(intRes?.results) ? intRes.results : intRes || []);
      } catch (e) {
        // Fallback to empty arrays
      }
      setLoading(false);
    };

    load();
    return () => { mounted = false; };
  }, []);

  // Jobs & Opportunities items
  const jobItems = useMemo(() => {
    const jobs = internships.slice(0, 4).map((job) => ({
      id: `job-${job.id}`,
      icon: BriefcaseIcon,
      title: job.role_title || job.title || 'Job Opening',
      subtitle: job.company_name || job.duration || 'Apply now',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
      actionLabel: 'Apply',
      onClick: () => navigate('/internships'),
    }));

    const eventCards = events.slice(0, 2).map((event) => ({
      id: `event-${event.id || event.event_id}`,
      icon: CalendarIcon,
      title: event.title || event.name || 'Event',
      subtitle: event.date_range || 'Coming soon',
      gradient: 'bg-gradient-to-br from-green-500 to-teal-500',
      actionLabel: 'Join',
      onClick: () => navigate('/events'),
    }));

    return [...jobs, ...eventCards];
  }, [events, internships, navigate]);

  // Recent Startups items (using posts data or mock data)
  const startupItems = useMemo(() => {
    // Mock recent startups - in real app, fetch from API
    const recentStartups = [
      { id: 's1', name: 'TechFlow AI', stage: 'MVP', founder: 'John D.' },
      { id: 's2', name: 'EduLearn', stage: 'Ideation', founder: 'Sarah M.' },
      { id: 's3', name: 'GreenCart', stage: 'Scaling', founder: 'Mike R.' },
      { id: 's4', name: 'HealthTrack', stage: 'MVP', founder: 'Lisa K.' },
    ];

    return recentStartups.map((startup) => ({
      id: `startup-${startup.id}`,
      icon: RocketIcon,
      title: startup.name,
      subtitle: `${startup.stage} · ${startup.founder}`,
      gradient: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      actionLabel: 'View',
      onClick: () => navigate('/'),
    }));
  }, [navigate]);

  if (loading) return null;

  return (
    <div className="space-y-5">
      {/* Jobs & Opportunities Section */}
      <ScrollSection
        title="Jobs & Opportunities"
        subtitle="Internships and events for you"
        items={jobItems}
        seeAllPath="/internships"
      />

      {/* Recent Startups Section */}
      <ScrollSection
        title="Recent Startups"
        subtitle="New ideas from the community"
        items={startupItems}
        seeAllPath="/"
      />
    </div>
  );
};

export default HomeQuickScroll;
