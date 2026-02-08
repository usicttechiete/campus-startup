import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Button from '../../components/Button/Button.jsx';
import Card from '../../components/Card/Card.jsx';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../../services/event.api.js';
import { useRole } from '../../context/RoleContext.jsx';

const eventFormTemplate = {
  name: '',
  description: '',
  event_type: 'Hackathon',
  event_date: '',
  registration_deadline: '',
  location: '',
  event_link: '',
  duration: '',
  team_size: '',
  registration_status: 'Open',
  schedule: '',
};

const Events = () => {
  const { role } = useRole();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventForm, setEventForm] = useState(eventFormTemplate);
  const [editingEventId, setEditingEventId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const isAdmin = role === 'admin';

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
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      if (editingEventId) {
        await updateEvent(editingEventId, eventForm);
        setSuccessMessage('Event updated successfully!');
      } else {
        await createEvent(eventForm);
        setSuccessMessage('Event created successfully!');
      }
      setEventForm(eventFormTemplate);
      setShowModal(false);
      setEditingEventId(null);
      await loadEvents();
    } catch (err) {
      setFormError(err.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setEventForm({
      name: event.name || '',
      description: event.description || '',
      event_type: event.event_type || 'Hackathon',
      event_date: event.event_date || '',
      registration_deadline: event.registration_deadline || '',
      location: event.location || '',
      event_link: event.event_link || '',
      duration: event.duration || '',
      team_size: event.team_size || '',
      registration_status: event.registration_status || 'Open',
      schedule: event.schedule || '',
    });
    setEditingEventId(event.id);
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await deleteEvent(eventId);
      setSuccessMessage('Event deleted successfully!');
      await loadEvents();
    } catch (err) {
      setError(err.message || 'Failed to delete event');
    }
  };

  const openCreateModal = () => {
    setEventForm(eventFormTemplate);
    setEditingEventId(null);
    setFormError(null);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isRegistrationOpen = (event) => {
    if (event.registration_status !== 'Open') return false;
    if (!event.registration_deadline) return true;
    return new Date(event.registration_deadline) >= new Date();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Events</h1>
          <p className="text-xs text-text-muted">Discover hackathons, workshops & competitions</p>
        </div>
        {isAdmin && (
          <Button size="sm" variant="primary" onClick={openCreateModal}>
            + Create Event
          </Button>
        )}
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-success-soft p-3 text-sm text-success">
          <span>✓</span> {successMessage}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader label="Loading events" />
        </div>
      ) : error ? (
        <Card className="p-6 text-center border-danger/20 bg-danger-soft">
          <p className="text-sm text-danger mb-3">{error}</p>
          <Button size="sm" variant="ghost" onClick={loadEvents}>
            Retry
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event.id} className="p-4 space-y-3 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-text-primary">{event.name}</h3>
                    {event.event_type && (
                      <Badge variant="primary">{event.event_type}</Badge>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm text-text-secondary line-clamp-2">{event.description}</p>
                  )}
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-xs font-medium text-danger hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {event.event_date && (
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <span>📅</span>
                    <span>Event: {formatDate(event.event_date)}</span>
                  </div>
                )}
                {event.registration_deadline && (
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <span>⏰</span>
                    <span>Register by: {formatDate(event.registration_deadline)}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <span>📍</span>
                    <span>{event.location}</span>
                  </div>
                )}
                {event.duration && (
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <span>⏱️</span>
                    <span>{event.duration}</span>
                  </div>
                )}
                {event.team_size && (
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <span>👥</span>
                    <span>Team: {event.team_size}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Badge variant={isRegistrationOpen(event) ? 'success' : 'neutral'}>
                    {isRegistrationOpen(event) ? 'Registration Open' : event.registration_status || 'Closed'}
                  </Badge>
                </div>
                {event.event_link && (
                  <a
                    href={event.event_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    See More →
                  </a>
                )}
              </div>
            </Card>
          ))}

          {!events.length && !loading && (
            <Card className="p-8 text-center">
              <div className="mb-3 text-4xl">🎉</div>
              <p className="text-sm text-text-secondary">No events available right now.</p>
              <p className="text-xs text-text-muted mt-1">
                {isAdmin ? 'Create your first event to get started!' : 'Check back soon for exciting opportunities!'}
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                {editingEventId ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <form className="p-4 space-y-4" onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-text-primary">Basic Information</h3>
                
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs text-text-muted">Event Name *</label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={eventForm.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Smart India Hackathon 2024"
                    className="input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="description" className="text-xs text-text-muted">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={3}
                    value={eventForm.description}
                    onChange={handleFormChange}
                    placeholder="Describe the event, what participants will do, prizes, etc."
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="event_type" className="text-xs text-text-muted">Event Type</label>
                    <select
                      id="event_type"
                      name="event_type"
                      value={eventForm.event_type}
                      onChange={handleFormChange}
                      className="input"
                    >
                      <option value="Hackathon">Hackathon</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Competition">Competition</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Conference">Conference</option>
                      <option value="Meetup">Meetup</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="registration_status" className="text-xs text-text-muted">Status</label>
                    <select
                      id="registration_status"
                      name="registration_status"
                      value={eventForm.registration_status}
                      onChange={handleFormChange}
                      className="input"
                    >
                      <option value="Open">Open</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dates & Location */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-text-primary">Dates & Location</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="event_date" className="text-xs text-text-muted">Event Date</label>
                    <input
                      id="event_date"
                      name="event_date"
                      type="date"
                      value={eventForm.event_date}
                      onChange={handleFormChange}
                      className="input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="registration_deadline" className="text-xs text-text-muted">Registration Deadline</label>
                    <input
                      id="registration_deadline"
                      name="registration_deadline"
                      type="date"
                      value={eventForm.registration_deadline}
                      onChange={handleFormChange}
                      className="input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="location" className="text-xs text-text-muted">Location</label>
                  <input
                    id="location"
                    name="location"
                    value={eventForm.location}
                    onChange={handleFormChange}
                    placeholder="e.g. Main Auditorium, Online, Hybrid"
                    className="input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="schedule" className="text-xs text-text-muted">Schedule</label>
                  <input
                    id="schedule"
                    name="schedule"
                    value={eventForm.schedule}
                    onChange={handleFormChange}
                    placeholder="e.g. Dec 15-17, 2024 or 9 AM - 5 PM"
                    className="input"
                  />
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-text-primary">Event Details</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="duration" className="text-xs text-text-muted">Duration</label>
                    <input
                      id="duration"
                      name="duration"
                      value={eventForm.duration}
                      onChange={handleFormChange}
                      placeholder="e.g. 2 days, 3 hours"
                      className="input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="team_size" className="text-xs text-text-muted">Team Size</label>
                    <input
                      id="team_size"
                      name="team_size"
                      value={eventForm.team_size}
                      onChange={handleFormChange}
                      placeholder="e.g. 2-4, Solo, 1-5"
                      className="input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="event_link" className="text-xs text-text-muted">Event Link</label>
                  <input
                    id="event_link"
                    name="event_link"
                    type="url"
                    value={eventForm.event_link}
                    onChange={handleFormChange}
                    placeholder="https://example.com/event-details"
                    className="input"
                  />
                  <p className="text-[10px] text-text-muted">Link to event website, registration form, or more details</p>
                </div>
              </div>

              {formError && <p className="text-xs text-danger">{formError}</p>}

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting} className="flex-1">
                  {submitting ? (
                    <Loader size="sm" inline label={editingEventId ? 'Updating' : 'Creating'} />
                  ) : (
                    editingEventId ? 'Update Event' : 'Create Event'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Events;
