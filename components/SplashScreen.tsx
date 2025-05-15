import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import bikeAnimation from '../public/lottie/bike-animation.json';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      onComplete();
    }, 3000); // 3 seconds for splash screen
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${
        animationComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-64 h-64 mb-6">
        <Lottie 
          animationData={bikeAnimation} 
          loop={true}
          autoplay={true}
        />
      </div>
      <h1 className="text-4xl font-bold mb-2 text-zinc-800 dark:text-white">
        BikeShare <span className="text-secondary">SP</span>
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Explore São Paulo de bicicleta
      </p>
    </div>
  );
};

export default SplashScreen;