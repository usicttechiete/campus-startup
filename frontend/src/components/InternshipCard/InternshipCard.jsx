import Card from '../Card/Card.jsx';
import Badge from '../Badge/Badge.jsx';

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

  const handleCardClick = () => {
    onViewDetails?.(internship);
  };

  return (
    <Card 
      className="p-3 cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-200 group"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Company & Role */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-text-primary truncate group-hover:text-primary transition-colors">
            {resolveValue(internship.company_name, 'Company')}
          </h3>
          <p className="text-xs text-text-muted truncate">
            {internship.role_title}
          </p>
          
          {/* Compact Info Row */}
          <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
            {location && (
              <span className="flex items-center gap-1">
                <span className="text-[10px]">📍</span>
                {location}
              </span>
            )}
            {stipend && (
              <span className="flex items-center gap-1">
                <span className="text-[10px]">💰</span>
                {stipend}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1">
                <span className="text-[10px]">⏱️</span>
                {duration}
              </span>
            )}
          </div>
        </div>

        {/* Right: Type Badge & CTA */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {workType && (
            <Badge variant="primary" className="text-[10px] px-2 py-0.5">
              {workType}
            </Badge>
          )}
          <button
            onClick={handleCardClick}
            className="text-[11px] font-medium text-primary hover:underline whitespace-nowrap"
          >
            View & Apply →
          </button>
        </div>
      </div>

      {/* Deadline if exists */}
      {deadlineText && (
        <div className="mt-2 pt-2 border-t border-border/50">
          <span className="text-[10px] text-text-muted">
            Apply by: <span className="font-medium text-text-secondary">{deadlineText}</span>
          </span>
        </div>
      )}
    </Card>
  );
};

export default InternshipCard;
