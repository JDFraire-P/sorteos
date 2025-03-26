import { NextApiRequest, NextApiResponse } from 'next';
import { getFolios } from '@/services/mongodb/folioService';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const folios = await getFolios();
  res.status(200).json(folios);
};

export default handler;