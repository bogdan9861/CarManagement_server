const { prisma } = require("../prisma/prisma.client");

const getDashboard = async (req, res) => {
  try {
    const now = new Date();

    const daysMap = {
      1: "Пн",
      2: "Вт",
      3: "Ср",
      4: "Чт",
      5: "Пт",
      6: "Сб",
      0: "Вс",
    };

    const tripsByDay = {
      Пн: 0,
      Вт: 0,
      Ср: 0,
      Чт: 0,
      Пт: 0,
      Сб: 0,
      Вс: 0,
    };

    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const drivers = await prisma.driverToAdmin.findMany({
      where: {
        adminId: req.user.id,
      },
      include: {
        driver: {
          include: {
            user: true,
          },
        },
      },
    });

    const reports = await prisma.report.findMany({
      where: {
        userId: {
          in: drivers.map((d) => d.driver.userId),
        },
        date: {
          gte: startOfWeek,
          lt: endOfWeek,
        },
      },
      select: {
        date: true,
      },
    });

    reports.forEach((r) => {
      const day = new Date(r.date).getDay();
      const dayName = daysMap[day];
      tripsByDay[dayName]++;
    });

    const tripData = Object.entries(tripsByDay).map(([day, trips]) => ({
      day,
      trips,
    }));

    const [carsCount, busyCarsCount, maintanceCarsCount, lastAddedCars] =
      await Promise.all([
        await prisma.car.count({
          where: {
            userId: req.user.id,
          },
        }),

        await prisma.car.count({
          where: {
            userId: req.user.id,
            status: "BUSY",
          },
        }),

        await prisma.car.count({
          where: {
            userId: req.user.id,
            status: "MAINTANCE",
          },
        }),

        await prisma.car.findMany({
          where: {
            userId: req.user.id,
          },
          take: 3,
        }),
      ]);

    res.status(200).json({
      tripData,
      carsCount,
      busyCarsCount,
      maintanceCarsCount,
      lastAddedCars,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  getDashboard,
};
