const { prisma } = require("../prisma/prisma.client");
const uploadFile = require("../utlls/uploadFile");

const createCar = async (req, res) => {
  try {
    const { name, number, year, driverId } = req.body;
    const file = req.file;

    const isExist = await prisma.car.findFirst({
      where: {
        number,
        userId: req.user.id,
      },
    });

    if (isExist) {
      return res
        .status(400)
        .json({ message: "Car with this number is already exist" });
    }

    const prismaCreateCar = async (url) => {
      const car = await prisma.car.create({
        data: {
          name,
          number,
          year,
          driverId,
          imageUrl: url,
          userId: req.user.id,
        },
      });

      res.status(201).json(car);
    };

    if (file?.path) {
      uploadFile(file?.path)
        .then(({ url }) => {
          prismaCreateCar(url);
        })
        .catch((e) => {
          res.status(500).json({ message: "Failed to upload file" });
        });
    } else {
      prismaCreateCar();
    }
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const editCar = async (req, res) => {
  try {
    const { name, number, year, driverId, status } = req.body;
    const { id } = req.params;
    const file = req.file;

    const car = await prisma.car.findFirst({
      where: {
        id,
      },
    });

    if (!car) {
      return res
        .status(404)
        .json({ message: "Cannot find car with speiied id" });
    }

    const prismaUpdateCar = async (url) => {
      const updatedCar = await prisma.car.update({
        where: {
          id,
        },
        data: {
          name: name || car.name,
          number: number || car.number,
          year: year || car.year,
          driverId: driverId || car.driverId,
          status: status || car.status,
          imageUrl: url || car.imageUrl,
        },
      });

      return res.status(200).json(updatedCar);
    };

    if (file?.path) {
      uploadFile(file?.path).then(({ url }) => {
        prismaUpdateCar(url);
      });
    } else {
      prismaUpdateCar();
    }
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const removeCar = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.car.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const getCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      where: {
        userId: req.user.id,
      },
    });

    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const chenageCarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const car = await prisma.car.findFirst({
      where: {
        id,
      },
    });

    if (!car) {
      return res
        .status(404)
        .json({ message: "Could not find car with specified id" });
    }

    const updatedCar = await prisma.car.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  createCar,
  editCar,
  removeCar,
  getCars,
  chenageCarStatus,
};
