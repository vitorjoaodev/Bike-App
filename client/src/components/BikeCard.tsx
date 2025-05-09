import { Bike } from "@/types";
import { useState } from "react";

type BikeCardProps = {
  bike: Bike;
  onClick: (bike: Bike) => void;
};

export default function BikeCard({ bike, onClick }: BikeCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  // Determine color of the battery indicator
  const getBatteryColor = () => {
    if (bike.batteryLevel > 70) return "bg-green-500";
    if (bike.batteryLevel > 30) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <div 
      className="hover-card flex items-center justify-between bg-white dark:bg-zinc-800 rounded-xl p-4 border-l-4 border-secondary border-t border-r border-b dark:border-gray-700 cursor-pointer transition-all duration-300 mb-3"
      onClick={() => onClick(bike)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${isHovering ? 'bg-secondary text-white' : 'bg-secondary bg-opacity-10 text-secondary'} mr-4 transition-colors duration-300`}>
          <span className={`material-icons ${isHovering ? 'bike-animation' : ''}`}>pedal_bike</span>
        </div>
        <div>
          <h4 className="font-medium text-lg">{bike.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{bike.description}</p>
          
          <div className="flex items-center mt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full mr-2">
              {bike.type}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              Aro {bike.wheelSize}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center">
          <div className="flex items-center mr-3">
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-2">
              <div 
                className={`h-full ${getBatteryColor()} transition-all duration-500`}
                style={{ width: `${bike.batteryLevel}%` }}
              ></div>
            </div>
            <span className="text-gray-600 dark:text-gray-300 text-sm">{bike.batteryLevel}%</span>
          </div>
          <div className={`rounded-full p-1 ${isHovering ? 'bg-secondary text-white' : 'text-gray-400'} transition-colors duration-300`}>
            <span className="material-icons">chevron_right</span>
          </div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {bike.condition === 'Excelente' ? '★★★★★' : '★★★★☆'}
        </span>
      </div>
    </div>
  );
}
