const Event = require('../models/Event');

const getEvents = async () => {
  try {
    const events = await Event.findAll();
    // In a real app, you might check registration status for the current user.
    // This would require joining with an 'event_registrations' table.
    return events.map((event) => ({ ...event, is_registered: false }));
  } catch (error) {
    throw new Error(`Error fetching events: ${error.message}`);
  }
};

const joinTeam = async (eventId, teamMembers) => {
  if (!eventId || !teamMembers || !teamMembers.length) {
    throw new Error('Event ID and team members are required');
  }
  // Placeholder for team registration logic
  // This would typically involve creating a team and linking it to the event.
  // eslint-disable-next-line no-console
  console.log(`User is attempting to join event ${eventId} with team:`, teamMembers);
  return { message: 'Team registration is not yet implemented' };
};

module.exports = {
  getEvents,
  joinTeam,
};
