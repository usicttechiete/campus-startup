import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFeed } from '../../services/feed.api.js';

const RocketIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
);

const ChevronIcon = ({ className, direction = 'right' }) => (
    <svg className={`${className} ${direction === 'left' ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m9 18 6-6-6-6" />
    </svg>
);

const stageColors = {
    Ideation: 'from-blue-500 to-indigo-600',
    MVP: 'from-green-500 to-emerald-600',
    Scaling: 'from-orange-500 to-red-500',
};

const StartupCard = ({ title, stage, authorName, onClick }) => (
    <button
        onClick={onClick}
        className="group flex flex-col items-center gap-2 min-w-[100px] p-3 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all active:scale-95"
    >
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stageColors[stage] || 'from-purple-500 to-indigo-600'} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
            <RocketIcon className="w-5 h-5 text-white" />
        </div>
        <div className="text-center">
            <p className="text-xs font-semibold text-gray-900 line-clamp-1 max-w-[85px]">{title}</p>
            <p className="text-[10px] text-gray-500 line-clamp-1">{authorName}</p>
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-600">
            {stage || 'View'}
        </span>
    </button>
);

const StartupsSuggestions = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showArrows, setShowArrows] = useState({ left: false, right: true });

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                // Fetch startup ideas from feed posts
                const res = await fetchFeed({ post_type: 'startup_idea', limit: 6 });
                if (!mounted) return;

                const posts = Array.isArray(res?.results) ? res.results : res || [];

                const startupCards = posts.slice(0, 5).map((post) => ({
                    id: `startup-${post.post_id || post.id}`,
                    title: post.title || 'Startup Idea',
                    stage: post.stage,
                    authorName: post.author?.name || post.authorProfile?.name || 'Anonymous',
                    onClick: () => navigate(`/project/${post.post_id || post.id}`),
                }));

                setItems(startupCards);
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
                    <span className="text-sm font-semibold text-gray-900">Recent Startups</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                </div>
                <button onClick={() => navigate('/')} className="text-xs text-purple-600 font-medium">
                    Explore →
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
                    {items.map((item) => <StartupCard key={item.id} {...item} />)}
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

export default StartupsSuggestions;
