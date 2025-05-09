import { Station } from "@/types";

type StationCardProps = {
  station: Station;
  onClick: (station: Station) => void;
};

export default function StationCard({ station, onClick }: StationCardProps) {
  const isAvailable = station.availableBikes > 0;
  
  return (
    <div 
      className={`bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm mb-3 border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow ${!isAvailable ? 'opacity-70' : ''}`}
      onClick={() => onClick(station)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{station.name}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{station.address}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`${isAvailable ? 'text-secondary' : 'text-destructive'} font-semibold`}>
            {station.availableBikes} bikes
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">{station.distance}</span>
        </div>
      </div>
      <div className="flex mt-3 items-center">
        <span className={`inline-block w-2 h-2 rounded-full ${isAvailable ? 'bg-secondary' : 'bg-destructive'} mr-2`}></span>
        <span className="text-sm">
          {isAvailable 
            ? `Disponível até ${station.closingTime}` 
            : 'Sem bicicletas disponíveis'}
        </span>
      </div>
    </div>
  );
}
