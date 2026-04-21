const { prisma } = require("../prisma/prisma.client");

const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notifications.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        report: true,
      },
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  getNotifications,
};
