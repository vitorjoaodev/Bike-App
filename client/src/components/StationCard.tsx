import { Station } from "@/types";
import { useState } from "react";

type StationCardProps = {
  station: Station;
  onClick: (station: Station) => void;
};

export default function StationCard({ station, onClick }: StationCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const isAvailable = station.availableBikes > 0;
  
  // Calculate dock usage percentage
  const dockUsagePercent = Math.floor(((station.totalDocks - station.availableBikes) / station.totalDocks) * 100);
  
  return (
    <div 
      className={`hover-card bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm mb-4 border-l-4 ${isAvailable ? 'border-secondary' : 'border-destructive'} border-t border-r border-b border-t-gray-100 border-r-gray-100 border-b-gray-100 dark:border-t-gray-700 dark:border-r-gray-700 dark:border-b-gray-700 cursor-pointer transition-all duration-300 ${!isAvailable ? 'opacity-90' : ''}`}
      onClick={() => onClick(station)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex justify-between items-start">
        <div className="flex">
          <div className={`p-2 rounded-full ${isHovering ? 'bg-secondary text-white' : 'bg-secondary bg-opacity-10 text-secondary'} mr-3 transition-colors duration-300`}>
            <span className="material-icons">place</span>
          </div>
          <div>
            <h3 className="font-medium text-lg">{station.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{station.address}</p>
            
            <div className="flex items-center mt-2">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full mr-2">
                <span className="material-icons text-xs mr-1">access_time</span>
                {station.openingTime} - {station.closingTime}
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                <span className="material-icons text-xs mr-1">directions_walk</span>
                {station.distance}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end ml-2">
          <div className={`flex items-center rounded-full px-2 py-1 ${isAvailable ? 'bg-secondary text-white' : 'bg-destructive text-white'} transition-colors duration-300`}>
            <span className="material-icons text-sm mr-1">pedal_bike</span>
            <span className="font-semibold text-sm">{station.availableBikes}</span>
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-xs mt-1">{station.walkingTime}</span>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span>Ocupação das vagas</span>
          <span>{dockUsagePercent}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${isAvailable ? 'bg-secondary' : 'bg-destructive'} transition-all duration-500`}
            style={{ width: `${dockUsagePercent}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex mt-3 items-center">
        <div className={`relative inline-block w-3 h-3 ${isAvailable ? 'bg-secondary' : 'bg-destructive'} rounded-full mr-2 ${isAvailable ? 'pulse-dot' : ''}`}>
          {isAvailable && (
            <span className="absolute top-0 left-0 w-full h-full rounded-full bg-secondary opacity-75 animate-ping"></span>
          )}
        </div>
        <span className="text-sm">
          {isAvailable 
            ? `${station.availableBikes} bicicletas disponíveis` 
            : 'Sem bicicletas disponíveis'}
        </span>
      </div>
    </div>
  );
}
