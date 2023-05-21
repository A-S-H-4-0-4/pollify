import HttpStatus from "http-status-codes";
import prisma from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
interface ResponseType {
    message: string;
    data: {};
    errors: Array<{}>;
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method === "GET") {
        let responseObject: ResponseType;
        try {
            const result = await prisma.user.findMany({
                select: {
                    candidateId:   true
                }
            });

            responseObject = {
                message: "success",
                data: { "data": result },
                errors: [],
            };
            // console.log(result);
            res.status(HttpStatus.OK).json(responseObject);
        } catch (error) {
            // console.log(error);
            responseObject = {
                message: "failed",
                data: {},
                errors: [{ errorMessage: error }],
            };
            res.status(HttpStatus.BAD_REQUEST).json(responseObject)
        }
    } 
};

