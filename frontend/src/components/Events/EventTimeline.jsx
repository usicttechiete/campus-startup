import clsx from 'clsx';

const statusStyles = {
  completed: 'border-success bg-success/10 text-success',
  active: 'border-primary bg-primary-light/40 text-primary',
  upcoming: 'border-white/40 bg-white/10 text-white/80',
};

const formatDateRange = (start, end) => {
  if (!start && !end) return 'TBA';
  const startDate = start ? new Date(start).toLocaleDateString() : 'TBA';
  const endDate = end ? new Date(end).toLocaleDateString() : 'TBA';
  return startDate === endDate ? startDate : `${startDate} → ${endDate}`;
};

const EventTimeline = ({ steps = [] }) => {
  if (!steps.length) {
    return <p className="text-sm text-white/80">Timeline will be announced soon.</p>;
  }

  return (
    <ol className="relative space-y-6 border-l border-white/20 pl-6 text-white">
      {steps.map((step, index) => {
        const status = step?.status || (step?.is_active ? 'active' : step?.is_completed ? 'completed' : 'upcoming');
        const style = statusStyles[status] || statusStyles.upcoming;
        const title = step?.title || step?.label || `Milestone ${index + 1}`;
        const description = step?.description;
        const start = step?.start_at || step?.start_date || step?.startTime;
        const end = step?.end_at || step?.end_date || step?.endTime;
        const range = formatDateRange(start, end);

        return (
          <li key={step?.id || step?.key || title + index} className="relative">
            <span className="absolute -left-[34px] flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[10px] font-semibold">
              {index + 1}
            </span>
            <div className={clsx('rounded-2xl border px-4 py-3 shadow-sm backdrop-blur-sm', style)}>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold leading-tight">{title}</h3>
                  <span className="rounded-full bg-white/20 px-2 py-[2px] text-[10px] uppercase tracking-wide">
                    {status}
                  </span>
                </div>
                <p className="text-xs text-white/80">{range}</p>
                {description && <p className="text-xs text-white/70">{description}</p>}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default EventTimeline;
