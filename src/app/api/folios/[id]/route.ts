import { NextApiRequest, NextApiResponse } from 'next';
import { getFolioByUID } from '@/services/mongodb/folioService';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const folio = await getFolioByUID(id as string);
  res.status(200).json(folio);
};

export default handler;