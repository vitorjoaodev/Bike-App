import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../server/db';
import { rentals } from '../../../shared/schema';
import { eq } from 'drizzle-orm';
import { formatCurrency } from '../../../lib/utils/formatters';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        // Permite filtrar por usuário se fornecido o parâmetro userId
        const { userId } = req.query;
        
        let rentalsList;
        if (userId && !Array.isArray(userId)) {
          const userIdNum = parseInt(userId, 10);
          
          if (isNaN(userIdNum)) {
            return res.status(400).json({ error: 'userId deve ser um número' });
          }
          
          rentalsList = await db
            .select()
            .from(rentals)
            .where(eq(rentals.userId, userIdNum));
        } else {
          rentalsList = await db.select().from(rentals);
        }
        
        // Formata os preços corretamente
        const formattedRentals = rentalsList.map(rental => ({
          ...rental,
          price: formatCurrency(rental.price)
        }));
        
        return res.status(200).json(formattedRentals);
      
      case 'POST':
        if (!req.body) {
          return res.status(400).json({ error: 'Dados do aluguel são obrigatórios' });
        }
        
        const newRental = await db.insert(rentals).values(req.body).returning();
        
        // Formata o preço
        const formattedRental = {
          ...newRental[0],
          price: formatCurrency(newRental[0].price)
        };
        
        return res.status(201).json(formattedRental);
      
      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro ao processar requisição de aluguéis:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}