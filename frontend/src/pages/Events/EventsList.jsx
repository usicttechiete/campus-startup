import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import EventCard from '../../components/Events/EventCard.jsx';
import { fetchEvents } from '../../services/event.api.js';

const eventTypeOptions = ['Hackathon', 'Workshop', 'Quiz', 'Seminar'];
const registrationStatusOptions = ['Open', 'Ongoing', 'Closed'];
const teamSizeOptions = ['Solo', '2-4', '5-6', 'Open'];
const suggestedSkillTags = ['React', 'Design', 'Product', 'Marketing', 'AI/ML', 'Blockchain'];

const FilterPill = ({ label, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-4 py-2 text-sm transition ${
      isActive ? 'bg-primary text-white shadow-md' : 'bg-surface text-muted hover:text-body'
    }`}
  >
    {label}
  </button>
);

const EventsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedTeamSizes, setSelectedTeamSizes] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleValue = (value, setter) => {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const appliedFilterCount = useMemo(
    () => selectedTypes.length + selectedStatuses.length + selectedTeamSizes.length + selectedSkills.length,
    [selectedTypes, selectedStatuses, selectedTeamSizes, selectedSkills],
  );

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedTeamSizes([]);
    setSelectedSkills([]);
  };

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search: searchTerm.trim() || undefined,
        type: selectedTypes,
        registrationStatus: selectedStatuses,
        teamSize: selectedTeamSizes,
        skills: selectedSkills,
      };
      const response = await fetchEvents(params);
      const results = Array.isArray(response?.results) ? response.results : Array.isArray(response) ? response : [];
      setEvents(results);
    } catch (err) {
      setError(err.message || 'Unable to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStatuses, selectedTeamSizes, selectedTypes, selectedSkills]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadEvents();
    }, 250);
    return () => clearTimeout(timeout);
  }, [loadEvents]);

  const handleSkillInput = (event) => {
    const value = event.target.value;
    const fragments = value.split(',').map((item) => item.trim()).filter(Boolean);
    setSelectedSkills(fragments);
  };

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold text-body">Campus Events</h1>
          <p className="text-sm text-muted">Discover hackathons, workshops, and challenges curated for your campus.</p>
        </div>

        <div className="flex flex-col gap-3 rounded-3xl bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search events, organizers, or tags"
              className="flex-1 rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              aria-label="Search events"
            />
            {appliedFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm font-semibold text-primary hover:text-primary-dark"
              >
                Clear filters ({appliedFilterCount})
              </button>
            )}
          </div>

          <div className="space-y-3">
            <section className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Event type</h2>
              <div className="flex flex-wrap gap-2">
                {eventTypeOptions.map((type) => (
                  <FilterPill
                    key={type}
                    label={type}
                    isActive={selectedTypes.includes(type)}
                    onClick={() => toggleValue(type, setSelectedTypes)}
                  />
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Registration status</h2>
              <div className="flex flex-wrap gap-2">
                {registrationStatusOptions.map((status) => (
                  <FilterPill
                    key={status}
                    label={status}
                    isActive={selectedStatuses.includes(status)}
                    onClick={() => toggleValue(status, setSelectedStatuses)}
                  />
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Team size</h2>
              <div className="flex flex-wrap gap-2">
                {teamSizeOptions.map((size) => (
                  <FilterPill
                    key={size}
                    label={size}
                    isActive={selectedTeamSizes.includes(size)}
                    onClick={() => toggleValue(size, setSelectedTeamSizes)}
                  />
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Required skills</h2>
              <div className="flex flex-wrap gap-2">
                {suggestedSkillTags.map((skill) => (
                  <FilterPill
                    key={skill}
                    label={skill}
                    isActive={selectedSkills.includes(skill)}
                    onClick={() => toggleValue(skill, setSelectedSkills)}
                  />
                ))}
              </div>
              <input
                type="text"
                placeholder="Add skills separated by commas"
                onChange={handleSkillInput}
                className="w-full rounded-2xl border border-border bg-surface px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </section>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-3xl bg-card/60 p-5">
              <div className="h-5 w-1/3 rounded-full bg-surface" />
              <div className="mt-2 h-4 w-1/2 rounded-full bg-surface/70" />
              <div className="mt-4 h-32 rounded-2xl bg-surface/60" />
            </div>
          ))}
        </div>
      ) : error ? (
        <Card className="border border-danger/20 bg-danger/5 text-danger">
          <p>{error}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((eventItem) => {
            const identifier = eventItem?.event_id || eventItem?.id;
            return (
              <EventCard key={identifier} event={eventItem} onClick={() => navigate(`/events/${identifier}`)} />
            );
          })}

          {!events.length && (
            <Card className="space-y-3 text-center text-sm text-muted">
              <p>No events match your filters just yet.</p>
              <p>Try broadening your search or check back for upcoming campus launches.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsList;
