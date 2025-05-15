import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/lib/ThemeProvider";

type AppSettingsProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AppSettings({ isOpen, onClose }: AppSettingsProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

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
          <h2 className="text-2xl font-semibold">Configurações</h2>
          <button className="text-zinc-800 dark:text-white" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Aparência</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Modo escuro</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ativar aparência escura
                </p>
              </div>
              <Switch 
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
            <h3 className="font-medium text-lg">Notificações</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Notificações push</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receber alertas e atualizações
                </p>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Notificações por email</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receber atualizações por email
                </p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
            <h3 className="font-medium text-lg">Privacidade</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="location-tracking">Rastreamento de localização</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Permitir acesso à sua localização
                </p>
              </div>
              <Switch id="location-tracking" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data-collection">Coleta de dados</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Permitir coleta de dados de uso
                </p>
              </div>
              <Switch id="data-collection" defaultChecked />
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
            <h3 className="font-medium text-lg">Conta</h3>
            
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={() => alert('Em construção')}
            >
              <span className="material-icons mr-2">lock</span>
              Alterar senha
            </Button>
            
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={() => alert('Em construção')}
            >
              <span className="material-icons mr-2">description</span>
              Termos de serviço
            </Button>
            
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={() => alert('Em construção')}
            >
              <span className="material-icons mr-2">security</span>
              Política de privacidade
            </Button>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <Button 
              variant="outline"
              className="w-full justify-center text-red-500 border-red-300 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-950 dark:text-red-400"
              onClick={() => confirm('Tem certeza de que deseja sair da sua conta?')}
            >
              Sair da conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}