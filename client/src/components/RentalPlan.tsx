import { Plan } from "@/types";

type RentalPlanProps = {
  plan: Plan;
  selected: boolean;
  onClick: (plan: Plan) => void;
};

export default function RentalPlan({ plan, selected, onClick }: RentalPlanProps) {
  return (
    <div 
      className={`bg-white dark:bg-zinc-800 border rounded-xl p-4 cursor-pointer hover:border-accent dark:hover:border-accent transition-colors relative ${selected ? 'border-accent' : 'border-gray-200 dark:border-gray-700'}`}
      onClick={() => onClick(plan)}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-accent text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
          POPULAR
        </div>
      )}
      <div className="flex justify-between mb-1">
        <h4 className="font-medium">{plan.name}</h4>
        <span className="font-semibold">{plan.price}</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
    </div>
  );
}
