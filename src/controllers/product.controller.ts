import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

// post products

export const postPorducts = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const data = await prisma.product.create({
      data: productData,
    });

    return res.status(200).json({
      success: true,
      message: "Products Data Createing",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Products Post Error in Server ${error}`,
    });
  }
};

// get products

export const getProducts = async (req: Request, res: Response) => {
  try {
    const getProdcutsData = req.body;

    const data = await prisma.product.findMany();

    return res.status(200).json({
      success: true,
      message: "Products Fetched Successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Prodcuts get is Error in ${error}`,
    });
  }
};
