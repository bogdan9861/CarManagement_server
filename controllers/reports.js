const { prisma } = require("../prisma/prisma.client");
const uploadFile = require("../utlls/uploadFile");

const createReport = async (req, res) => {
  try {
    const { name, carId, status } = req.body;
    const file = req.file;

    const prismaCreateReport = async (url) => {
      const car = await prisma.car.findFirst({
        where: {
          id: carId,
        },
      });

      if (!car) {
        return res
          .status(404)
          .json({ message: "Could not find car with specefied id" });
      }

      const driverAdminRelation = await prisma.driverToAdmin.findFirst({
        where: {
          driverId: req.user.drivers[0].id,
        },
        include: {
          driver: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      if (!driverAdminRelation) {
        return res.status(404).json({
          message: "Cannot create report because admin cannot be found",
        });
      }

      const report = await prisma.report.create({
        data: {
          name,
          carId,
          userId: req.user.id,
          fileUrl: url || "",
        },
        include: {
          reportedCar: true,
          driver: true,
        },
      });

      await prisma.notifications.create({
        data: {
          userId: driverAdminRelation.adminId,
          title: "Новый отчёт",
          message: `Водитель ${driverAdminRelation.driver.user.firstName} ${driverAdminRelation.driver.user.lastName} подготовил отчёт по автомобилю: ${car.name} ${car.number}`,
          reportId: report.id,
        },
      });

      await prisma.car.update({
        where: {
          id: carId,
        },
        data: {
          status: status || "READY",
        },
      });

      return res.status(201).json(report);
    };

    await prisma.$transaction(
      async (params) => {
        if (req.user.role !== "DRIVER") {
          return res
            .status(400)
            .json({ message: "Only the driver can create reports." });
        }

        if (file?.path) {
          uploadFile(file.path)
            .then(({ url }) => {
              prismaCreateReport(url);
            })
            .catch((e) => {
              return res.status(500).json({ message: "Failed to upload file" });
            });
        } else {
          prismaCreateReport();
        }
      },
      { maxWait: 5000, timeout: 20000 }
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const editReport = async (req, res) => {
  try {
    const { name, carId } = req.body;
    const { id } = req.params;
    const file = req.file;

    const report = await prisma.report.findFirst({
      where: {
        id,
      },
    });

    if (!report) {
      return res
        .status(404)
        .json({ message: "Cannot find report with specefied id" });
    }

    const prismaUpdateReport = async (url) => {
      const updatedReport = await prisma.report.update({
        where: {
          id,
        },
        data: {
          name: name || report.name,
          carId: carId || report.carId,
          fileUrl: url || report.fileUrl,
        },
      });

      return res.status(200).json(updatedReport);
    };

    if (file?.path) {
      uploadFile(file.path).then(({ url }) => {
        prismaUpdateReport(url);
      });
    } else {
      prismaUpdateReport();
    }
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const getReports = async (req, res) => {
  try {
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

    console.log(drivers);

    const repots = await prisma.report.findMany({
      where: {
        userId: {
          in: drivers.map((d) => d.driver.user.id),
        },
      },
      include: {
        reportedCar: true,
        driver: true,
      },
    });

    res.status(200).json(repots);
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const removeReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findFirst({
      where: {
        id,
      },
    });

    if (!report) {
      return res
        .status(404)
        .json({ message: "Cannot find report with specefied id" });
    }

    await prisma.report.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const getMyReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        reportedCar: true,
        driver: true,
      },
    });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  createReport,
  editReport,
  getReports,
  removeReport,
  getMyReports,
};
