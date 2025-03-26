import { NextApiHandler } from "next";
import { createFolio } from "@/services/mongodb/folioService";

const handler: NextApiHandler = async (req, res) => {
    try {
        if (req.method === "POST") {
            const sorteo = req.body.sorteo;
            const telefono = req.body.telefono;
            const boletos = req.body.boletos;
            const folio = await createFolio( sorteo, telefono, boletos );
            res.status(201).json(folio);
        } else {
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).end(error.message);
        } else {
            res.status(500).end("An unknown error occurred");
        }
    }
};

export default handler;