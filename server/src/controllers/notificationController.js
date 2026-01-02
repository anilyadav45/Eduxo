import Notification from "../models/Notification.js";

// Admin creates announcement
export const createNotification = async (req, res) => {
  const notification = await Notification.create(req.body);
  res.status(201).json(notification);
};

// Student/Teacher fetch notifications
export const getMyNotifications = async (req, res) => {
  const user = req.user;

  const notifications = await Notification.find({
    $and: [
      {
        $or: [
          { roles: user.role },
          { roles: { $size: 0 } }, // global
        ],
      },
      {
        $or: [
          { semester: null },
          { semester: user.semester },
        ],
      },
    ],
  }).sort({ createdAt: -1 });

  res.json(
    notifications.map((n) => ({
      id: n._id,
      title: n.title,
      message: n.message,
      createdAt: n.createdAt,
      read: n.readBy.includes(user._id),
    }))
  );
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  const { id } = req.params;

  await Notification.findByIdAndUpdate(id, {
    $addToSet: { readBy: req.user._id },
  });

  res.json({ message: "Marked as read" });
};
