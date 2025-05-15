import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../server/db';
import { bikes } from '../../../shared/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        // Permite filtrar por estação se fornecido o parâmetro stationId
        const { stationId } = req.query;
        
        let bikesList;
        if (stationId && !Array.isArray(stationId)) {
          const stationIdNum = parseInt(stationId, 10);
          
          if (isNaN(stationIdNum)) {
            return res.status(400).json({ error: 'stationId deve ser um número' });
          }
          
          bikesList = await db
            .select()
            .from(bikes)
            .where(eq(bikes.stationId, stationIdNum));
        } else {
          bikesList = await db.select().from(bikes);
        }
        
        return res.status(200).json(bikesList);
      
      case 'POST':
        if (!req.body) {
          return res.status(400).json({ error: 'Dados da bicicleta são obrigatórios' });
        }
        
        const newBike = await db.insert(bikes).values(req.body).returning();
        return res.status(201).json(newBike[0]);
      
      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro ao processar requisição de bicicletas:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}