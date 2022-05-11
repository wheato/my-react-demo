// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import staticData from '../../../data/apes.json';

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

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CustomResponse>
) {
  const { page, size = 20 } = req.query;
  const resData: CustomResponse = {
    message: 'OK',
    retcode: 0,
    data: {
      page: 0,
      count: 0,
      total: 0,
      list: []
    }
  }
  const pageNum = +page ?? 0;
  const sizeNum = +size ?? 0;

  // 没有 page 参数时，返回全部
  if (page) {
    resData.data.total = staticData.length;
    resData.data.list = staticData;
  } else {
    const total = staticData.length;
    const from = sizeNum * (pageNum - 1);
    const end = (sizeNum * pageNum) >= total ? total : (sizeNum * pageNum);
    const listData = from >= end ? [] : staticData.slice(from, end);
    resData.data = {
      page: pageNum,
      count: listData.length,
      total: total,
      list: listData
    }
  }
  res.status(200).json(resData);
}
