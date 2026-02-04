import clsx from 'clsx';
import Badge from '../Badge/Badge.jsx';
import Button from '../Button/Button.jsx';
import { formatSkills } from '../../utils/formatters.js';

const statusLabels = {
  open: { label: 'Open', variant: 'success' },
  pending: { label: 'Pending', variant: 'neutral' },
  full: { label: 'Full', variant: 'primary' },
  locked: { label: 'Locked', variant: 'neutral' },
};

const TeamCard = ({ team, onRequestJoin, actionLoading = false, disabled = false }) => {
  if (!team) return null;

  const {
    id,
    team_id: teamId,
    name,
    leader,
    leader_profile: leaderProfile,
    required_skills: requiredSkills,
    members = [],
    current_size: currentSize,
    max_size: maxSize,
    status,
    is_open: isOpen,
    description,
  } = team;

  const effectiveStatus = status || (isOpen ? 'open' : 'locked');
  const statusConfig = statusLabels[effectiveStatus] || statusLabels.open;
  const identifier = id || teamId;
  const displayLeader = leader?.name || leaderProfile?.name || leader?.email || leaderProfile?.email || 'Team Lead';
  const displaySkills = formatSkills(requiredSkills);
  const memberCount = currentSize || members.length;
  const capacityLabel = maxSize ? `${memberCount}/${maxSize}` : `${memberCount}`;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-body">{name || 'Untitled Team'}</h3>
          <p className="text-sm text-muted">Lead: {displayLeader}</p>
        </div>
        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
      </header>

      {description && <p className="text-sm leading-relaxed text-muted">{description}</p>}

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="rounded-full bg-surface px-3 py-1 font-semibold text-body">{capacityLabel} members</span>
        {maxSize && maxSize - memberCount > 0 ? (
          <span className="rounded-full bg-success/10 px-3 py-1 font-semibold text-success">
            {maxSize - memberCount} spots left
          </span>
        ) : (
          <span className="rounded-full bg-white/70 px-3 py-1 font-semibold text-muted">No slots available</span>
        )}
      </div>

      {!!displaySkills.length && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Required skills</p>
          <div className="flex flex-wrap gap-2">
            {displaySkills.map((skill) => (
              <span key={`${identifier}-${skill}`} className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        {members.slice(0, 3).map((member) => (
          <span key={member?.id || member?.user_id || member} className="rounded-full bg-surface px-3 py-1 font-semibold text-body">
            {member?.name || member?.user?.name || 'Member'}
          </span>
        ))}
        {members.length > 3 && <span className="text-xs text-muted">+{members.length - 3} more</span>}
      </div>

      {onRequestJoin && (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="primary"
            onClick={() => onRequestJoin(identifier)}
            disabled={disabled || actionLoading || effectiveStatus !== 'open' || (maxSize && memberCount >= maxSize)}
            className={clsx('rounded-full px-4', (actionLoading || disabled) && 'opacity-70')}
          >
            {actionLoading ? 'Sending...' : 'Request to Join'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
