const Notification = require('../models/Notification');
const User = require('../models/User');

const createLetsBuildNotification = async (recipientId, actorId, postId, postTitle) => {
  let actorName = 'Someone';
  try {
    const user = await User.findById(actorId);
    if (user?.name) actorName = user.name;
  } catch (e) { /* ignore */ }
  const message = `${actorName} wants to build with you on "${postTitle || 'your post'}"`;
  return Notification.create({
    recipient_id: recipientId,
    actor_id: actorId,
    type: 'lets_build',
    post_id: postId,
    message,
  });
};

const getMyNotifications = async (userId, options = {}) => {
  return Notification.findByRecipient(userId, options);
};

const markAsRead = async (notificationId, userId) => {
  return Notification.markAsRead(notificationId, userId);
};

module.exports = {
  createLetsBuildNotification,
  getMyNotifications,
  markAsRead,
};
