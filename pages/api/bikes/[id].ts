import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../server/db';
import { bikes } from '../../../shared/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  
  const bikeId = parseInt(id, 10);
  
  if (isNaN(bikeId)) {
    return res.status(400).json({ error: 'ID deve ser um número' });
  }
  
  try {
    switch (req.method) {
      case 'GET':
        const bike = await db.select().from(bikes).where(eq(bikes.id, bikeId));
        
        if (bike.length === 0) {
          return res.status(404).json({ error: 'Bicicleta não encontrada' });
        }
        
        return res.status(200).json(bike[0]);
      
      case 'PUT':
        if (!req.body) {
          return res.status(400).json({ error: 'Dados da bicicleta são obrigatórios' });
        }
        
        const updatedBike = await db
          .update(bikes)
          .set(req.body)
          .where(eq(bikes.id, bikeId))
          .returning();
        
        if (updatedBike.length === 0) {
          return res.status(404).json({ error: 'Bicicleta não encontrada' });
        }
        
        return res.status(200).json(updatedBike[0]);
      
      case 'DELETE':
        const deletedBike = await db
          .delete(bikes)
          .where(eq(bikes.id, bikeId))
          .returning();
        
        if (deletedBike.length === 0) {
          return res.status(404).json({ error: 'Bicicleta não encontrada' });
        }
        
        return res.status(200).json({ message: 'Bicicleta excluída com sucesso' });
      
      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error(`Erro ao processar requisição para bicicleta ${id}:`, error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}