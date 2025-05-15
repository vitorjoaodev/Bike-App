import { Plan } from "@/types";
import { useState } from "react";

type RentalPlanProps = {
  plan: Plan;
  selected: boolean;
  onClick: (plan: Plan) => void;
};

export default function RentalPlan({ plan, selected, onClick }: RentalPlanProps) {
  const [isHovering, setIsHovering] = useState(false);

  // Function to calculate a fake discount based on plan id
  const getDiscount = (id: number) => {
    switch (id) {
      case 2: return 10; // Daily plan discount
      case 3: return 25; // Weekly plan discount
      default: return 0;
    }
  };
  
  const discount = getDiscount(plan.id);
  
  return (
    <div 
      className={`hover-card bg-white dark:bg-zinc-800 border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 relative 
        ${selected 
          ? 'border-secondary shadow-md shadow-secondary/20' 
          : isHovering 
            ? 'border-secondary/50 shadow-sm' 
            : 'border-gray-200 dark:border-gray-700'}`}
      onClick={() => onClick(plan)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Popular tag */}
      {plan.popular && (
        <div className="absolute -top-2 -right-2 bg-secondary text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md transform-gpu rotate-3 select-none">
          MAIS POPULAR
        </div>
      )}
      
      {/* Discount tag */}
      {discount > 0 && (
        <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md transform-gpu -rotate-3 select-none">
          {`-${discount}%`}
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full ${selected ? 'bg-secondary' : 'bg-secondary bg-opacity-10'} flex items-center justify-center mr-3 transition-colors duration-300`}>
            {plan.id === 1 && <span className="material-icons text-white">schedule</span>}
            {plan.id === 2 && <span className="material-icons text-white">today</span>}
            {plan.id === 3 && <span className="material-icons text-white">date_range</span>}
          </div>
          <h4 className="font-medium text-lg">{plan.name}</h4>
        </div>
        
        <div className="text-right">
          <div className="flex flex-col items-end">
            {discount > 0 && (
              <span className="text-xs line-through text-gray-400 mb-1">
                {`R$ ${(parseFloat(plan.price.replace('R$ ', '').replace(',', '.').replace('/hora', '').replace('/dia', '').replace('/semana', '')) * (100 / (100 - discount))).toFixed(2).replace('.', ',')}`}
              </span>
            )}
            <span className="font-semibold text-lg text-secondary">{plan.price}</span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 ml-13">{plan.description}</p>
      
      {/* Features section */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {plan.id >= 1 && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full flex items-center">
              <span className="material-icons text-xs mr-1">lock_open</span>
              Desbloqueio ilimitado
            </span>
          )}
          {plan.id >= 2 && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full flex items-center">
              <span className="material-icons text-xs mr-1">receipt_long</span>
              Recibo para reembolso
            </span>
          )}
          {plan.id >= 3 && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full flex items-center">
              <span className="material-icons text-xs mr-1">support_agent</span>
              Suporte prioritário
            </span>
          )}
        </div>
      </div>
      
      {/* Selection indicator */}
      {selected && (
        <div className="absolute -right-2 -bottom-2 bg-secondary text-white rounded-full p-1">
          <span className="material-icons text-sm">check</span>
        </div>
      )}
    </div>
  );
}
