import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../Badge/Badge.jsx';
import { fetchEvents } from '../../services/event.api.js';
import { fetchInternships } from '../../services/internship.api.js';

const formatDate = (value) => {
  if (!value) return 'Date TBA';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const getLatest = (items, getDate, limit = 2) =>
  [...items]
    .sort((a, b) => {
      const aDate = new Date(getDate(a) || 0).getTime();
      const bDate = new Date(getDate(b) || 0).getTime();
      return bDate - aDate;
    })
    .slice(0, limit);

const QuickItemCard = ({ title, subtitle, badgeLabel, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-56 flex-shrink-0 flex-col gap-3 rounded-3xl border border-border bg-card p-4 text-left shadow-soft transition hover:border-primary/40"
  >
    <div className="flex items-center justify-between gap-2">
      <Badge variant="neutral" className="uppercase tracking-wide">
        {badgeLabel}
      </Badge>
    </div>
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-body line-clamp-2">{title}</h3>
      <p className="text-xs text-muted">{subtitle}</p>
    </div>
  </button>
);

const HomeQuickScroll = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadQuickItems = async () => {
      setLoading(true);
      try {
        const [eventResponse, internshipResponse] = await Promise.all([
          fetchEvents(),
          fetchInternships(),
        ]);

        const eventResults = Array.isArray(eventResponse?.results) ? eventResponse.results : eventResponse || [];
        const internshipResults = Array.isArray(internshipResponse?.results)
          ? internshipResponse.results
          : internshipResponse || [];

        if (!isMounted) return;

        setEvents(eventResults);
        setInternships(internshipResults);
      } catch (error) {
        if (!isMounted) return;
        setEvents([]);
        setInternships([]);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    loadQuickItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const quickItems = useMemo(() => {
    const latestEvents = getLatest(events, (event) => event.created_at || event.start_time, 2).map((event) => ({
      id: event.event_id || event.id,
      title: event.title || event.name || 'Event',
      subtitle: formatDate(event.start_time || event.created_at || event.date_range),
      badgeLabel: 'Event',
      onClick: () => navigate('/events'),
    }));

    const latestInternships = getLatest(internships, (internship) => internship.created_at, 2).map((internship) => ({
      id: internship.id || internship.job_id,
      title: internship.role_title || internship.title || 'Internship',
      subtitle:
        internship.duration ||
        internship.duration_text ||
        internship.duration_label ||
        formatDate(internship.created_at),
      badgeLabel: 'Internship',
      onClick: () => navigate('/internships'),
    }));

    return [...latestEvents, ...latestInternships].filter((item) => item.id).slice(0, 4);
  }, [events, internships, navigate]);

  if (loading || !quickItems.length) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-body">Quick Picks</h2>
        <span className="text-xs text-muted">Events & Internships</span>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {quickItems.map((item) => (
          <QuickItemCard key={`${item.badgeLabel}-${item.id}`} {...item} />
        ))}
      </div>
    </section>
  );
};

export default HomeQuickScroll;
