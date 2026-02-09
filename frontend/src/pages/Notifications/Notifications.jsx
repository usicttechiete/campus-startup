import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/Card/Card.jsx';
import Button from '../../components/Button/Button.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import { getMyNotifications, markNotificationRead } from '../../services/notification.api.js';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getMyNotifications();
            setNotifications(data.results || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'APPLICATION': return '📄';
            case 'MESSAGE': return '💬';
            case 'SYSTEM': return '⚙️';
            case 'STARTUP': return '🚀';
            default: return '🔔';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-8 sm:pt-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-body tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            Notifications
                        </h1>
                        <p className="text-muted mt-1">Stay updated with your campus activity</p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate('/profile')} className="rounded-xl border border-border/40">
                        Back to Profile
                    </Button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader size="lg" />
                        <p className="text-muted animate-pulse font-medium">Fetching your updates...</p>
                    </div>
                ) : error ? (
                    <Card className="p-12 text-center border-danger/20 bg-danger/5">
                        <p className="text-danger font-bold">{error}</p>
                        <Button variant="primary" onClick={fetchNotifications} className="mt-4">Retry</Button>
                    </Card>
                ) : notifications.length === 0 ? (
                    <Card className="p-20 text-center bg-white/40 backdrop-blur-md rounded-[3rem] border-dashed border-2 border-border/20">
                        <div className="text-6xl mb-6">📭</div>
                        <h2 className="text-2xl font-bold text-body">All caught up!</h2>
                        <p className="text-muted mt-2">No new notifications at the moment.</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {notifications.map((notif, index) => (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card
                                        className={`p-6 rounded-[2rem] transition-all hover:shadow-lg border-l-4 ${notif.is_read ? 'border-l-transparent opacity-80' : 'border-l-primary bg-white shadow-md'
                                            }`}
                                    >
                                        <div className="flex gap-4 items-start">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                                                {getIcon(notif.notification_type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className={`font-bold text-body truncate ${notif.is_read ? '' : 'text-primary'}`}>
                                                        {notif.title}
                                                    </h3>
                                                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest whitespace-nowrap ml-2">
                                                        {new Date(notif.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted leading-relaxed line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                {!notif.is_read && (
                                                    <div className="mt-3 flex gap-2">
                                                        <Button size="xs" variant="ghost" onClick={() => handleMarkAsRead(notif.id)} className="text-[10px] font-extrabold uppercase tracking-tighter hover:bg-primary/5">
                                                            Mark as read
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
