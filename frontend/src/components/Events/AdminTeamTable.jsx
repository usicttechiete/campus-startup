import Button from '../Button/Button.jsx';
import Loader from '../Loader/Loader.jsx';
import Badge from '../Badge/Badge.jsx';

const statusVariants = {
  pending: { label: 'Pending', variant: 'neutral' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'danger' },
  locked: { label: 'Locked', variant: 'primary' },
  open: { label: 'Open', variant: 'primary' },
};

const AdminTeamTable = ({
  teams = [],
  onApprove,
  onReject,
  onLock,
  actionLoadingId,
}) => {
  if (!teams.length) {
    return (
      <div className="rounded-3xl border border-border bg-card p-4 text-sm text-muted">
        No teams created yet. Encourage participants to start formations.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="grid grid-cols-12 gap-4 border-b border-border bg-surface px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
        <span className="col-span-3">Team</span>
        <span className="col-span-2">Leader</span>
        <span className="col-span-2">Members</span>
        <span className="col-span-2">Status</span>
        <span className="col-span-3 text-right">Actions</span>
      </div>
      <div className="divide-y divide-border/60">
        {teams.map((team) => {
          const identifier = team.id || team.team_id;
          const statusKey = team.status || (team.is_locked ? 'locked' : team.is_approved ? 'approved' : team.is_rejected ? 'rejected' : 'pending');
          const statusConfig = statusVariants[statusKey] || statusVariants.pending;
          const leader = team.leader?.name || team.leader_name || '—';
          const memberCount = team.members?.length ?? team.current_size ?? 0;
          const capacity = team.max_size ? `${memberCount}/${team.max_size}` : memberCount;

          return (
            <div key={identifier} className="grid grid-cols-12 gap-4 px-5 py-4 text-sm">
              <div className="col-span-3">
                <p className="font-semibold text-body">{team.name}</p>
                {team.required_skills?.length && (
                  <p className="text-xs text-muted">Skills: {team.required_skills.join(', ')}</p>
                )}
              </div>
              <div className="col-span-2 text-muted">{leader}</div>
              <div className="col-span-2 text-muted">{capacity} members</div>
              <div className="col-span-2">
                <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
              </div>
              <div className="col-span-3 flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="subtle"
                  onClick={() => onApprove?.(identifier)}
                  disabled={actionLoadingId === identifier}
                  className="rounded-full px-4"
                >
                  {actionLoadingId === identifier ? <Loader size="sm" inline /> : 'Approve'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onReject?.(identifier)}
                  disabled={actionLoadingId === identifier}
                  className="rounded-full px-4 text-danger"
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onLock?.(identifier)}
                  disabled={actionLoadingId === identifier || statusKey === 'locked'}
                  className="rounded-full px-4"
                >
                  Lock
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminTeamTable;
