import Event from '../models/Event.js';

// Get all events
const getEventsController = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json({ results: events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single event by ID
const getEventByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new event (Admin only)
const createEventController = async (req, res) => {
  try {
    const {
      name,
      description,
      duration,
      team_size,
      registration_status,
      schedule,
      event_date,
      registration_deadline,
      location,
      event_link,
      event_type,
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const newEvent = await Event.create({
      name,
      description,
      duration: duration || null,
      team_size: team_size || null,
      registration_status: registration_status || 'Open',
      schedule: schedule || null,
      event_date: event_date || null,
      registration_deadline: registration_deadline || null,
      location: location || null,
      event_link: event_link || null,
      event_type: event_type || null,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update event (Admin only)
const updateEventController = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      duration,
      team_size,
      registration_status,
      schedule,
      event_date,
      registration_deadline,
      location,
      event_link,
      event_type,
    } = req.body;

    const updatedEvent = await Event.update(id, {
      name,
      description,
      duration,
      team_size,
      registration_status,
      schedule,
      event_date,
      registration_deadline,
      location,
      event_link,
      event_type,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete event (Admin only)
const deleteEventController = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.delete(id);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  getEventsController,
  getEventByIdController,
  createEventController,
  updateEventController,
  deleteEventController,
};
