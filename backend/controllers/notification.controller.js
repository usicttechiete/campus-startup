import {
  getMyNotifications,
  markAsRead,
} from '../services/notification.service.js';

const getMyNotificationsController = async (req, res) => {
  try {
    const { unread_only } = req.query;
    const notifications = await getMyNotifications(req.user.id, {
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
    const updated = await markAsRead(id, req.user.id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  getMyNotificationsController,
  markAsReadController,
};
