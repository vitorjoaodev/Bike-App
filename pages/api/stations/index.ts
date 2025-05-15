import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../server/db';
import { stations } from '../../../shared/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const allStations = await db.select().from(stations);
        return res.status(200).json(allStations);
      
      case 'POST':
        // Verificar autenticação seria necessário em produção
        if (!req.body) {
          return res.status(400).json({ error: 'Dados da estação são obrigatórios' });
        }
        
        const newStation = await db.insert(stations).values(req.body).returning();
        return res.status(201).json(newStation[0]);
      
      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro ao processar requisição de estações:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}