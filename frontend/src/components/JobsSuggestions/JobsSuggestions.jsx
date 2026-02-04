import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchInternships } from '../../services/internship.api.js';
import { fetchEvents } from '../../services/event.api.js';

const BriefcaseIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const CalendarIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
);

const ChevronIcon = ({ className, direction = 'right' }) => (
    <svg className={`${className} ${direction === 'left' ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m9 18 6-6-6-6" />
    </svg>
);

const SuggestionCard = ({ icon: Icon, title, subtitle, gradient, actionLabel, onClick }) => (
    <button
        onClick={onClick}
        className="group flex flex-col items-center gap-2 min-w-[100px] p-3 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all active:scale-95"
    >
        <div className={`w-11 h-11 rounded-xl ${gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="text-center">
            <p className="text-xs font-semibold text-gray-900 line-clamp-1 max-w-[85px]">{title}</p>
            <p className="text-[10px] text-gray-500 line-clamp-1">{subtitle}</p>
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-600">
            {actionLabel}
        </span>
    </button>
);

const JobsSuggestions = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showArrows, setShowArrows] = useState({ left: false, right: true });

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const [intRes, evRes] = await Promise.all([fetchInternships(), fetchEvents()]);
                if (!mounted) return;

                const internships = Array.isArray(intRes?.results) ? intRes.results : intRes || [];
                const events = Array.isArray(evRes?.results) ? evRes.results : evRes || [];

                const jobCards = internships.slice(0, 4).map((job) => ({
                    id: `job-${job.id}`,
                    icon: BriefcaseIcon,
                    title: job.role_title || job.title || 'Job Opening',
                    subtitle: job.company_name || job.duration || 'Apply now',
                    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
                    actionLabel: 'Apply',
                    onClick: () => navigate('/internships'),
                }));

                const eventCards = events.slice(0, 2).map((event) => ({
                    id: `event-${event.id || event.event_id}`,
                    icon: CalendarIcon,
                    title: event.title || event.name || 'Event',
                    subtitle: event.date_range || 'Join now',
                    gradient: 'bg-gradient-to-br from-green-500 to-teal-500',
                    actionLabel: 'Join',
                    onClick: () => navigate('/events'),
                }));

                setItems([...jobCards, ...eventCards]);
            } catch (e) {
                setItems([]);
            }
            setLoading(false);
        };

        load();
        return () => { mounted = false; };
    }, [navigate]);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowArrows({
            left: scrollLeft > 10,
            right: scrollLeft < scrollWidth - clientWidth - 10
        });
    };

    const scroll = (direction) => {
        scrollRef.current?.scrollBy({ left: direction === 'left' ? -150 : 150, behavior: 'smooth' });
    };

    if (loading || items.length === 0) return null;

    return (
        <section className="bg-gray-50 -mx-4 px-4 py-4 rounded-none border-y border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">Jobs & Opportunities</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <button onClick={() => navigate('/internships')} className="text-xs text-blue-600 font-medium">
                    See all →
                </button>
            </div>

            <div className="relative">
                {showArrows.left && (
                    <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white shadow border flex items-center justify-center">
                        <ChevronIcon direction="left" className="w-3 h-3 text-gray-600" />
                    </button>
                )}

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {items.map((item) => <SuggestionCard key={item.id} {...item} />)}
                </div>

                {showArrows.right && items.length > 3 && (
                    <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white shadow border flex items-center justify-center">
                        <ChevronIcon className="w-3 h-3 text-gray-600" />
                    </button>
                )}
            </div>
        </section>
    );
};

export default JobsSuggestions;
