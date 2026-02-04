import { useEffect, useState } from 'react';
import Loader from '../../components/Loader/Loader.jsx';
import { fetchEvents } from '../../services/event.api.js';
import { useRole } from '../../context/RoleContext.jsx';

const Events = () => {
  const { role } = useRole();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents();
      setEvents(Array.isArray(data?.results) ? data.results : data || []);
    } catch (err) {
      setError(err.message || 'Unable to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    // Set mock data for demo
    setEvents([
      {
        id: 1,
        name: 'Smart India Hackathon',
        date_range: 'Dec 15 - 17, 2024',
        stages: [
          { key: 'registration', label: 'Registration Open', status: 'active' },
          { key: 'submission', label: 'Project Submission', status: 'pending' },
          { key: 'judging', label: 'Judging', status: 'pending' }
        ]
      },
      {
        id: 2,
        name: 'Workshop on AI',
        date_range: 'Dec 15 - 17, 2024',
        stages: [
          { key: 'registration', label: 'Registration Open', status: 'active' },
          { key: 'submission', label: 'Project Submission', status: 'pending' },
          { key: 'judging', label: 'Project Submission', status: 'pending' }
        ]
      },
      {
        id: 3,
        name: 'Quiz competition',
        date_range: 'Dec 15 - 17, 2024',
        stages: [
          { key: 'registration', label: 'Registration Open', status: 'active' },
          { key: 'submission', label: 'Project Submission', status: 'pending' },
          { key: 'judging', label: 'Judging', status: 'pending' }
        ]
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm">
        <button className="p-1 -ml-1">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Events</h1>
      </div>

      {role === 'admin' && (
        <div className="px-4 pb-2">
          <button
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-95"
            onClick={() => alert('Create Event feature coming soon!')}
          >
            + Create New Event
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader label="Loading events" />
          </div>
        ) : (
          <>
            {events.map((event, index) => (
              <div key={event.id}
                className="relative overflow-hidden rounded-3xl p-5 text-white shadow-lg"
                style={{
                  background: 'linear-gradient(180deg, #D9D9D9 0%, #737373 100%)',
                  minHeight: '160px'
                }}>
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20" />

                <div className="relative h-full flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold leading-tight">{event.name}</h3>
                    <p className="text-sm text-white/90 font-medium">{event.date_range}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4">
                    {event.stages?.map((stage, stageIndex) => (
                      <div key={stage.key || stageIndex} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-600" />
                        <span className="text-xs font-bold text-white leading-tight">{stage.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {!events.length && !loading && (
              <div className="text-center py-10 text-gray-500">
                No events available right now. Check back soon!
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Events;
