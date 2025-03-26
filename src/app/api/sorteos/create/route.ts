import { NextApiHandler } from 'next';
import { createSorteo } from '@/services/mongodb/sorteoService';

const handler: NextApiHandler = async (req, res) => {
    try {
        if (req.method === 'POST') {
            const sorteo = req.body.sorteo;
            const sorteoDoc = await createSorteo(sorteo);
            res.status(201).json(sorteoDoc);
        } else {
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).end(error.message);
        } else {
            res.status(500).end('An unknown error occurred');
        }
    }
};

export default handler;