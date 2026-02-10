import Card from '../Card/Card.jsx';
import Button from '../Button/Button.jsx';

const ProfileSection = ({
    title,
    icon,
    children,
    onEdit,
    action,
    className = ''
}) => {
    return (
        <Card className={`mb-4 ${className}`} padding="lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center text-primary">
                            {icon}
                        </div>
                    )}
                    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
                </div>
                {(onEdit || action) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit || action?.onClick}
                    >
                        {action?.label || 'Edit'}
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="space-y-4">
                {children}
            </div>
        </Card>
    );
};

// Experience Item Component
export const ExperienceItem = ({ experience }) => {
    if (!experience) return null;

    return (
        <div className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
            {/* Company Logo */}
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-bg-subtle">
                {experience.logo ? (
                    <img
                        src={experience.logo}
                        alt={experience.company}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-xl font-bold">
                        {experience.company?.[0] || '?'}
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary">
                    {experience.title}
                </h3>
                <p className="text-sm text-text-secondary">
                    {experience.company}
                </p>
                <p className="text-xs text-text-muted mt-1">
                    {experience.period} • {experience.duration}
                </p>
                {experience.description && (
                    <p className="text-sm text-text-secondary mt-2 line-clamp-3">
                        {experience.description}
                    </p>
                )}
            </div>
        </div>
    );
};

// Skills Component
export const SkillsList = ({ skills = [] }) => {
    if (!skills || skills.length === 0) {
        return (
            <p className="text-sm text-text-muted">No skills added yet</p>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
                <span
                    key={`${skill}-${index}`}
                    className="px-3 py-1.5 bg-primary-50 text-primary rounded-full text-sm font-medium border border-primary-100"
                >
                    {skill}
                </span>
            ))}
        </div>
    );
};

export default ProfileSection;
