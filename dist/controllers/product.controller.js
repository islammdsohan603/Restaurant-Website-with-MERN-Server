import prisma from "../lib/prisma.js";
export const postPorducts = async (req, res) => {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Products Post Error in Server ${error}`,
        });
    }
};
