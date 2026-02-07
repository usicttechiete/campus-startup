const notificationService = require('../services/notification.service');

const getMyNotificationsController = async (req, res) => {
  try {
    const { unread_only } = req.query;
    const notifications = await notificationService.getMyNotifications(req.user.id, {
      unreadOnly: unread_only === 'true',
    });
    res.status(200).json({ results: notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsReadController = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await notificationService.markAsRead(id, req.user.id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMyNotificationsController,
  markAsReadController,
};
