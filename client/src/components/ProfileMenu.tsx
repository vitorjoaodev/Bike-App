import { useEffect, useRef } from 'react';
import { Link } from 'wouter';

type ProfileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ProfileMenu({ isOpen, onClose }: ProfileMenuProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (drawerRef.current) {
      if (isOpen) {
        drawerRef.current.classList.remove('translate-x-full');
      } else {
        drawerRef.current.classList.add('translate-x-full');
      }
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        ref={drawerRef}
        className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white dark:bg-zinc-900 shadow-lg p-4 overflow-y-auto custom-scrollbar transform transition-transform ease-in-out duration-300 translate-x-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Meu Perfil</h2>
          <button className="text-zinc-800 dark:text-white" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
            <span className="material-icons text-3xl text-gray-500 dark:text-gray-400">person</span>
          </div>
          <div>
            <h3 className="font-medium text-lg">João Silva</h3>
            <p className="text-gray-600 dark:text-gray-300">joao.silva@email.com</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          <Link href="/profile">
            <a className="flex items-center p-3 bg-gray-100 dark:bg-zinc-800 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
              <span className="material-icons mr-3 text-gray-600 dark:text-gray-300">history</span>
              <span>Histórico de Aluguéis</span>
            </a>
          </Link>
          <a href="#" className="flex items-center p-3 bg-gray-100 dark:bg-zinc-800 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
            <span className="material-icons mr-3 text-gray-600 dark:text-gray-300">credit_card</span>
            <span>Métodos de Pagamento</span>
          </a>
          <a href="#" className="flex items-center p-3 bg-gray-100 dark:bg-zinc-800 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
            <span className="material-icons mr-3 text-gray-600 dark:text-gray-300">settings</span>
            <span>Configurações</span>
          </a>
          <a href="#" className="flex items-center p-3 bg-gray-100 dark:bg-zinc-800 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
            <span className="material-icons mr-3 text-gray-600 dark:text-gray-300">help_outline</span>
            <span>Ajuda e Suporte</span>
          </a>
        </div>
        
        <button className="w-full flex items-center justify-center p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <span className="material-icons mr-2 text-gray-600 dark:text-gray-300">logout</span>
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
