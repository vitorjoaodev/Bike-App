import React, { useState, useEffect } from 'react';
// Implementação temporária do botão enquanto migramos o projeto
const Button = ({ 
  children, 
  className = '', 
  variant = 'default', 
  size = 'default',
  onClick
}: any) => (
  <button 
    className={`px-4 py-2 rounded font-medium ${
      variant === 'outline' 
        ? 'border border-gray-300 bg-transparent' 
        : 'bg-secondary text-white'
    } ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

interface ReferralSnackbarProps {
  show: boolean;
  onClose: () => void;
}

const ReferralSnackbar: React.FC<ReferralSnackbarProps> = ({ show, onClose }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 10000); // Auto hide after 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-4 z-50 slide-in-bottom">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-secondary bg-opacity-20 rounded-full p-2 mr-3">
          <span className="material-icons text-secondary">card_giftcard</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-zinc-800 dark:text-white mb-1">Indique um amigo</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-3">
            Ganhe uma diária de bicicleta onde você desejar ao indicar um amigo que se cadastrar!
          </p>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-600"
              onClick={onClose}
            >
              Depois
            </Button>
            <Button 
              size="sm" 
              className="bg-secondary hover:bg-green-600 text-white"
            >
              Indicar agora
            </Button>
          </div>
        </div>
        <button 
          className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white ml-1"
          onClick={onClose}
        >
          <span className="material-icons text-sm">close</span>
        </button>
      </div>
    </div>
  );
};

export default ReferralSnackbar;