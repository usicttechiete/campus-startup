import Avatar from '../Avatar/Avatar.jsx';
import Button from '../Button/Button.jsx';
import Badge from '../Badge/Badge.jsx';
import Card from '../Card/Card.jsx';

const ProfileHeader = ({
    user,
    isOwnProfile = false,
    onEditProfile,
    onConnect,
    onMessage,
    className = ''
}) => {
    if (!user) return null;

    return (
        <Card padding="none" className={`mb-4 overflow-hidden ${className}`}>
            {/* Banner */}
            <div
                className="h-32 bg-gradient-to-r from-primary-500 to-primary-700"
                style={{
                    backgroundImage: user.banner ? `url(${user.banner})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            {/* Main Content */}
            <div className="px-4 pb-4">
                {/* Avatar - overlap banner */}
                <div className="-mt-12 mb-3">
                    <Avatar
                        src={user.avatar}
                        alt={user.name || user.email}
                        size="xl"
                        className="border-4 border-white shadow-lg"
                    />
                </div>

                {/* Name & Title */}
                <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-text-primary">
                            {user.name || user.email?.split('@')[0] || 'User'}
                        </h1>
                        {user.verified && (
                            <Badge variant="success">
                                ✓ Verified
                            </Badge>
                        )}
                    </div>
                    <p className="text-base text-text-secondary">
                        {user.title || 'Student'} {user.college && `• ${user.college}`}
                    </p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 text-sm text-text-muted mb-4">
                    {user.location && (
                        <span className="flex items-center gap-1">
                            📍 {user.location}
                        </span>
                    )}
                    {user.website && (
                        <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                        >
                            🔗 {user.websiteName || 'Website'}
                        </a>
                    )}
                    {user.connections && (
                        <span>{user.connections}+ connections</span>
                    )}
                </div>

                {/* Action Buttons */}
                {!isOwnProfile ? (
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            className="flex-1"
                            onClick={onConnect}
                        >
                            Connect
                        </Button>
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={onMessage}
                        >
                            Message
                        </Button>
                        <Button variant="ghost" className="px-3">
                            •••
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="secondary"
                        className="w-full"
                        onClick={onEditProfile}
                    >
                        Edit Profile
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default ProfileHeader;
