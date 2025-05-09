import { Bike } from "@/types";

type BikeCardProps = {
  bike: Bike;
  onClick: (bike: Bike) => void;
};

export default function BikeCard({ bike, onClick }: BikeCardProps) {
  return (
    <div 
      className="flex items-center justify-between bg-white dark:bg-zinc-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-accent dark:hover:border-accent transition-colors mb-2"
      onClick={() => onClick(bike)}
    >
      <div className="flex items-center">
        <span className="material-icons text-accent mr-3">pedal_bike</span>
        <div>
          <h4 className="font-medium">{bike.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{bike.description}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-gray-600 dark:text-gray-300 text-sm mr-2">Bateria: {bike.batteryLevel}%</span>
        <span className="material-icons text-gray-400">chevron_right</span>
      </div>
    </div>
  );
}
