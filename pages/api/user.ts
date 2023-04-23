import HttpStatus from "http-status-codes";
import prisma from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
interface ResponseType {
    message: string;
    data: {};
    errors: Array<{}>;
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body, query } = req;
    const { phoneNumber, adharNo, studentId } = query

    if (method === "GET") {
        let responseObject: ResponseType;
        try {
            const result = await prisma.user.findFirst({
                where: {
                    OR: [
                        { phoneNumber: (phoneNumber === undefined || phoneNumber === null) ? "" : phoneNumber + "", },
                        { adharNo: (adharNo === undefined || adharNo === null) ? "" : adharNo + "", },
                        { studentId: (studentId === undefined || studentId === null) ? "" : studentId + "", }
                    ],
                },
                select: {
                    phoneNumber: true,
                    adharNo: true,
                    studentId: true
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
    } else if (method === "POST") {
        let responseObject: ResponseType
        try {
            let { fullName,
                phoneNumber,
                age,
                dob,
                gender,
                studentId,
                adharNo,
                candidateName,
                candidateId } = body
            const result = await prisma.user.create({
                data: {
                    fullName: fullName,
                    phoneNumber: phoneNumber,
                    age: age,
                    dob: dob,
                    gender: gender,
                    studentId: studentId,
                    adharNo: adharNo,
                    candidateName: candidateName,
                    candidateId: candidateId + ''
                }
            });
            responseObject = {
                message: "success",
                data: { "data": result },
                errors: []
            }
            res.status(HttpStatus.OK).json(responseObject)
        } catch (error) {
            responseObject = {
                message: "failed",
                data: {},
                errors: [{ errorMessage: error }],
            };
            res.status(HttpStatus.BAD_REQUEST).json(responseObject)
        }
    }

};

