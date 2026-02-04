import Card from '../Card/Card.jsx';
import Badge from '../Badge/Badge.jsx';
import Button from '../Button/Button.jsx';
import Loader from '../Loader/Loader.jsx';

const DurationIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

const StipendIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3v18" />
    <path d="M16.5 7.5c0-1.66-2.01-3-4.5-3s-4.5 1.34-4.5 3 2.01 3 4.5 3 4.5 1.34 4.5 3-2.01 3-4.5 3-4.5-1.34-4.5-3" />
  </svg>
);

const LocationIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s7-5.33 7-12a7 7 0 0 0-14 0c0 6.67 7 12 7 12Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
);

const resolveValue = (value, fallback = 'Not specified') => {
  if (value === null || value === undefined || value === '') return fallback;
  return value;
};

const formatDuration = (internship) => {
  const duration = internship.duration || internship.duration_text || internship.duration_label;
  if (duration) return duration;
  const months = internship.duration_months ?? internship.duration_month;
  if (months) return `${months} month${Number(months) === 1 ? '' : 's'}`;
  const weeks = internship.duration_weeks ?? internship.duration_week;
  if (weeks) return `${weeks} week${Number(weeks) === 1 ? '' : 's'}`;
  return null;
};

const formatDeadline = (deadlineValue) => {
  if (!deadlineValue) return null;
  const date = new Date(deadlineValue);
  if (Number.isNaN(date.getTime())) return deadlineValue;
  return date.toLocaleDateString();
};

const InternshipCard = ({
  internship,
  onViewDetails,
  onResumeChange,
  resumeValue,
  onSubmit,
  isApplied,
  applyLoading,
}) => {
  if (!internship) return null;

  const stipend =
    internship.stipend ||
    internship.salary_range ||
    internship.compensation ||
    internship.stipend_range ||
    internship.salary ||
    null;
  const duration = formatDuration(internship);
  const location = internship.location || internship.mode || internship.work_mode || internship.work_location || null;
  const workType = internship.type || internship.work_type || internship.role_type || null;
  const deadline =
    internship.application_deadline || internship.deadline || internship.apply_by || internship.application_closes;
  const deadlineText = formatDeadline(deadline);
  
  const metadata = [
    {
      icon: DurationIcon,
      label: 'Duration',
      value: resolveValue(duration),
    },
    {
      icon: StipendIcon,
      label: 'Stipend',
      value: resolveValue(stipend),
    },
    {
      icon: LocationIcon,
      label: 'Location',
      value: resolveValue(location),
    },
    {
      icon: CalendarIcon,
      label: 'Apply by',
      value: resolveValue(deadlineText),
    },
  ];

  const handleResumeInputChange = (event) => {
    onResumeChange?.(internship.id, event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(internship);
  };

  return (
    <Card className="space-y-4 border border-border/40 bg-card transition hover:border-primary/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-body">{internship.role_title}</h3>
          <p className="mt-1 text-sm text-muted">{resolveValue(internship.company_name)}</p>
        </div>
        {workType && (
          <Badge variant="neutral" className="capitalize">
            {workType}
          </Badge>
        )}
      </div>

      {internship.description && (
        <p className="rounded-2xl bg-surface px-4 py-3 text-sm text-muted">{internship.description}</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {metadata.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 rounded-2xl border border-border/40 bg-surface px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
              <p className="text-sm font-medium text-body">{value}</p>
            </div>
          </div>
        ))}
      </div>

      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Button variant="subtle" size="sm" onClick={() => onViewDetails?.(internship.id)} className="w-full sm:w-auto">
          View Details
        </Button>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <div className="flex-1 sm:w-64">
            <label htmlFor={`resume-${internship.id}`} className="sr-only">
              Resume / Portfolio Link
            </label>
            <input
              id={`resume-${internship.id}`}
              type="url"
              required
              placeholder="https://"
              value={resumeValue}
              onChange={handleResumeInputChange}
              disabled={isApplied}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button
            type="submit"
            variant={isApplied ? 'subtle' : 'primary'}
            size="sm"
            disabled={isApplied || applyLoading}
            className="whitespace-nowrap"
          >
            {applyLoading ? (
              <Loader size="sm" inline label="Submitting" />
            ) : isApplied ? (
              'Application Submitted'
            ) : (
              'Submit Application'
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default InternshipCard;
