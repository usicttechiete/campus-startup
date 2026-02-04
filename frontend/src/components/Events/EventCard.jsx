import clsx from 'clsx';
import { formatRelativeTime } from '../../utils/formatters.js';

const defaultTimelineStages = [
  { key: 'registration', label: 'Registration' },
  { key: 'team_formation', label: 'Team Formation' },
  { key: 'submission', label: 'Submission' },
  { key: 'judging', label: 'Judging' },
  { key: 'results', label: 'Results' },
];

const getEventTitle = (eventData) => eventData?.title || eventData?.name || 'Untitled Event';

const getEventDateRange = (eventData) => {
  if (eventData?.date_range) return eventData.date_range;
  const startsAt = eventData?.start_time || eventData?.start_at;
  const endsAt = eventData?.end_time || eventData?.end_at;
  if (!startsAt && !endsAt) return 'Dates coming soon';
  const startDate = startsAt ? new Date(startsAt).toLocaleDateString() : 'TBA';
  const endDate = endsAt ? new Date(endsAt).toLocaleDateString() : 'TBA';
  return `${startDate} - ${endDate}`;
};

const TimelinePill = ({ label, isActive, isCompleted }) => (
  <div
    className={clsx(
      'flex-1 rounded-full px-3 py-1 text-center text-[11px] font-semibold tracking-wide',
      isActive && 'bg-white/90 text-body shadow-sm',
      isCompleted && !isActive && 'bg-white/30 text-body/80',
      !isActive && !isCompleted && 'bg-white/10 text-white/70',
    )}
  >
    {label}
  </div>
);

const EventCard = ({ event, onClick }) => {
  if (!event) return null;

  const title = getEventTitle(event);
  const dateRange = getEventDateRange(event);
  const status = event?.status || event?.registration_status || 'Open';
  const gradient = event?.theme_gradient || 'from-[#0047FF] via-[#5B7CFF] to-[#6DC7FF]';
  const timelineStages = Array.isArray(event?.timeline)
    ? event.timeline
    : Array.isArray(event?.stages)
    ? event.stages
    : defaultTimelineStages;
  const currentStageKey = event?.current_stage || event?.active_stage;
  const createdAt = event?.created_at;
  const organizerName = event?.organizer?.name || event?.organizer_name;

  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div
        className={clsx(
          'relative overflow-hidden rounded-3xl p-5 text-white shadow-lg transition hover:shadow-xl',
          'bg-gradient-to-br',
          gradient,
        )}
      >
        <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
        <div className="relative space-y-4">
          <header className="space-y-1">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              {status}
            </span>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-white/80">{dateRange}</p>
            {organizerName && <p className="text-xs text-white/70">Hosted by {organizerName}</p>}
          </header>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/70">Timeline</span>
            <div className="flex flex-wrap gap-2">
              {timelineStages.map((stage, index) => {
                const key = stage?.key || stage?.id || index;
                const label = stage?.label || stage?.name || String(stage);
                const statusValue = stage?.status;
                const isActive = statusValue ? statusValue === 'active' : currentStageKey && key === currentStageKey;
                const isCompleted = statusValue ? statusValue === 'completed' : index < timelineStages.findIndex((s) => (s?.key || s?.id) === currentStageKey);
                return <TimelinePill key={key} label={label} isActive={isActive} isCompleted={isCompleted} />;
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/80">
            <span>
              Team size: {event?.team_size || event?.max_team_size || 'Varies'}
            </span>
            {createdAt && <span>Published {formatRelativeTime(createdAt)}</span>}
          </div>
        </div>
      </div>
    </button>
  );
};

export default EventCard;
