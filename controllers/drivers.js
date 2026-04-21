const { prisma } = require("../prisma/prisma.client");
const uploadFile = require("../utlls/uploadFile");
const bcrypt = require("bcrypt");

const createDriver = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const isExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (isExist) {
      return res.status(409).json({
        message: "User already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.$transaction(async (params) => {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: "DRIVER",
        },
      });

      const driver = await prisma.driver.create({
        data: {
          userId: user.id,
        },
        include: {
          user: true,
          cars: true,
        },
      });

      await prisma.driverToAdmin.create({
        data: {
          driverId: driver.id,
          adminId: req.user.id,
        },
      });

      res.status(201).json(driver);
    }, 10000);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const editDriver = async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    const { id } = req.params;

    const driver = await prisma.driver.findFirst({
      where: {
        id,
      },
    });

    if (!driver) {
      return res
        .status(404)
        .json({ message: "Cannot find driver with speiied id" });
    }

    const updatedDriver = await prisma.driver.update({
      where: {
        id,
      },
      data: {
        user: {
          update: {
            firstName: firstName || driver.firstName,
            lastName: lastName || driver.lastName,
            email: email || driver.email,
          },
        },
      },
      include: {
        user: true,
      },
    });

    return res.status(200).json(updatedDriver);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const removeDriver = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const getMyCars = async (req, res) => {
  try {
    const cars = await prisma.driver.findFirst({
      where: {
        userId: req.user.id,
      },
      select: {
        cars: true,
      },
    });

    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  removeDriver,
  editDriver,
  createDriver,
  getMyCars,
};
