import Card from '../Card/Card.jsx';
import Badge from '../Badge/Badge.jsx';
import Button from '../Button/Button.jsx';
import Loader from '../Loader/Loader.jsx';

const DurationIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const StipendIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const resolveValue = (value, fallback = '—') => {
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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  const handleResumeInputChange = (event) => {
    onResumeChange?.(internship.id, event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(internship);
  };

  return (
    <Card className="space-y-3 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-text-primary truncate">{internship.role_title}</h3>
          <p className="text-sm text-text-muted truncate">{resolveValue(internship.company_name, 'Company')}</p>
        </div>
        {workType && (
          <Badge variant="primary" className="flex-shrink-0">
            {workType}
          </Badge>
        )}
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-2 gap-2">
        {duration && (
          <div className="flex items-center gap-2 rounded-lg bg-bg-glass p-2">
            <div className="icon-circle-sm">
              <DurationIcon className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wide">Duration</p>
              <p className="text-xs font-medium text-text-secondary">{duration}</p>
            </div>
          </div>
        )}
        {stipend && (
          <div className="flex items-center gap-2 rounded-lg bg-bg-glass p-2">
            <div className="icon-circle-sm icon-circle-accent">
              <StipendIcon className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wide">Stipend</p>
              <p className="text-xs font-medium text-text-secondary">{stipend}</p>
            </div>
          </div>
        )}
        {location && (
          <div className="flex items-center gap-2 rounded-lg bg-bg-glass p-2">
            <div className="icon-circle-sm">
              <LocationIcon className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wide">Location</p>
              <p className="text-xs font-medium text-text-secondary">{location}</p>
            </div>
          </div>
        )}
        {deadlineText && (
          <div className="flex items-center gap-2 rounded-lg bg-bg-glass p-2">
            <div className="icon-circle-sm">
              <CalendarIcon className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wide">Apply by</p>
              <p className="text-xs font-medium text-text-secondary">{deadlineText}</p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {internship.description && (
        <p className="text-sm text-text-muted line-clamp-2">{internship.description}</p>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-2 border-t border-divider">
        {onViewDetails && (
          <Button type="button" variant="subtle" size="sm" onClick={() => onViewDetails(internship)} className="w-fit">
            View details
          </Button>
        )}
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              required
              placeholder="Paste resume link..."
              value={resumeValue}
              onChange={handleResumeInputChange}
              disabled={isApplied}
              className="input text-xs flex-1"
            />
            <Button
              type="submit"
              variant={isApplied ? 'ghost' : 'primary'}
              size="sm"
              disabled={isApplied || applyLoading}
            >
              {applyLoading ? (
                <Loader size="sm" inline />
              ) : isApplied ? (
                'Applied ✓'
              ) : (
                'Apply'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default InternshipCard;
