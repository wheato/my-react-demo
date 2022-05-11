// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type TokenName = 'Bored Ape Yacht Club' | 'Mutant Ape Yacht Club' | 'Otherdeed for Otherside';
interface DataItem {
  token: TokenName;
  token_id: number;
  holder: string;
  hold_from_timestamp: number;
}
interface CustomResponse {
  message: string;
  retcode: number;
  data: {
    page: number;
    count: number;
    total: number;
    list: DataItem[];
  }
}

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}
