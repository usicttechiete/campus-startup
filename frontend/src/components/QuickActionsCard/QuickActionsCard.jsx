import Card from '../Card/Card.jsx';
import Button from '../Button/Button.jsx';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const ActionIcon = ({ className }) => (
    <svg className={clsx("w-5 h-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </svg>
);

const QuickActionsCard = ({ stats }) => {
    const navigate = useNavigate();
    return (
        <Card className="mb-4" padding="lg">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center">
                    <ActionIcon className="text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-text-primary">Quick Actions</h2>
            </div>
            <div className="space-y-3">
                <ActionItem
                    label={stats?.pendingApprovals > 0 ? `${stats.pendingApprovals} pending approvals` : 'No pending approvals'}
                    action={stats?.pendingApprovals > 0 ? 'Review' : null}
                    onClick={() => navigate('/pending')}
                    disabled={!stats?.pendingApprovals}
                />
                <ActionItem
                    label={stats?.newJobs > 0 ? `${stats.newJobs} new job postings` : 'No new job postings'}
                    action={stats?.newJobs > 0 ? 'View' : null}
                    onClick={() => navigate('/internships')}
                    disabled={!stats?.newJobs}
                />
                <ActionItem
                    label="Create new post"
                    action="Post"
                    onClick={() => { }}
                />
            </div>
        </Card>
    );
};

const ActionItem = ({ label, action, onClick, disabled }) => {
    return (
        <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className={clsx('text-sm', disabled ? 'text-text-muted' : 'text-text-secondary')}>
                {label}
            </span>
            {action && (
                <Button size="sm" variant={disabled ? 'ghost' : 'secondary'} onClick={onClick} disabled={disabled}>
                    {action}
                </Button>
            )}
        </div>
    );
};

export default QuickActionsCard;
