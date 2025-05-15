import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../server/db';
import { stations } from '../../../shared/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  
  const stationId = parseInt(id, 10);
  
  if (isNaN(stationId)) {
    return res.status(400).json({ error: 'ID deve ser um número' });
  }
  
  try {
    switch (req.method) {
      case 'GET':
        const station = await db.select().from(stations).where(eq(stations.id, stationId));
        
        if (station.length === 0) {
          return res.status(404).json({ error: 'Estação não encontrada' });
        }
        
        return res.status(200).json(station[0]);
      
      case 'PUT':
        if (!req.body) {
          return res.status(400).json({ error: 'Dados da estação são obrigatórios' });
        }
        
        const updatedStation = await db
          .update(stations)
          .set(req.body)
          .where(eq(stations.id, stationId))
          .returning();
        
        if (updatedStation.length === 0) {
          return res.status(404).json({ error: 'Estação não encontrada' });
        }
        
        return res.status(200).json(updatedStation[0]);
      
      case 'DELETE':
        const deletedStation = await db
          .delete(stations)
          .where(eq(stations.id, stationId))
          .returning();
        
        if (deletedStation.length === 0) {
          return res.status(404).json({ error: 'Estação não encontrada' });
        }
        
        return res.status(200).json({ message: 'Estação excluída com sucesso' });
      
      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error(`Erro ao processar requisição para estação ${id}:`, error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}