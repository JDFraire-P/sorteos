import { NextApiRequest, NextApiResponse } from "next";

// endpoint para confirmar un folio (UPDATE)
const confirmFolio = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const { method } = req;

    // si el metodo es POST
    if (method === 'POST') {
        // se confirma el folio
        res.status(200).json({ id, message: 'Folio confirmado' });
    }
    // si el metodo no es POST
    else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default confirmFolio;
