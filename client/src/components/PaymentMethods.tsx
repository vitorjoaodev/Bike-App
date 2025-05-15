import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type PaymentMethodsProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PaymentMethods({ isOpen, onClose }: PaymentMethodsProps) {
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
          <h2 className="text-2xl font-semibold">Métodos de Pagamento</h2>
          <button className="text-zinc-800 dark:text-white" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="space-y-6">
          <RadioGroup defaultValue="card-1" className="gap-4">
            {/* Cartão 1 */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg border-gray-200 dark:border-gray-700">
              <RadioGroupItem value="card-1" id="card-1" />
              <div className="grid gap-1 flex-1">
                <Label htmlFor="card-1" className="font-medium">
                  Visa •••• 4242
                </Label>
                <div className="text-sm text-gray-500 dark:text-gray-400">Expira em 12/25</div>
              </div>
              <div className="flex items-center justify-center w-12 h-8 bg-blue-600 rounded-md">
                <span className="material-icons text-white">credit_card</span>
              </div>
            </div>

            {/* Cartão 2 */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg border-gray-200 dark:border-gray-700">
              <RadioGroupItem value="card-2" id="card-2" />
              <div className="grid gap-1 flex-1">
                <Label htmlFor="card-2" className="font-medium">
                  Mastercard •••• 5555
                </Label>
                <div className="text-sm text-gray-500 dark:text-gray-400">Expira em 09/24</div>
              </div>
              <div className="flex items-center justify-center w-12 h-8 bg-red-600 rounded-md">
                <span className="material-icons text-white">credit_card</span>
              </div>
            </div>
            
            {/* PIX */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg border-gray-200 dark:border-gray-700">
              <RadioGroupItem value="pix" id="pix" />
              <div className="grid gap-1 flex-1">
                <Label htmlFor="pix" className="font-medium">
                  PIX
                </Label>
                <div className="text-sm text-gray-500 dark:text-gray-400">Pagamento instantâneo</div>
              </div>
              <div className="flex items-center justify-center w-12 h-8 bg-green-500 rounded-md">
                <span className="material-icons text-white">bolt</span>
              </div>
            </div>
          </RadioGroup>
          
          <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Adicionar novo cartão</h3>
            <form className="space-y-3">
              <div>
                <Label htmlFor="card-number">Número do cartão</Label>
                <Input 
                  id="card-number"
                  placeholder="0000 0000 0000 0000"
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry-date">Data de validade</Label>
                  <Input 
                    id="expiry-date"
                    placeholder="MM/AA"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv"
                    placeholder="000"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="card-holder">Nome no cartão</Label>
                <Input 
                  id="card-holder"
                  placeholder="Nome completo"
                  className="mt-1"
                />
              </div>
              
              <Button 
                className="w-full bg-secondary hover:bg-secondary/90 text-white py-2 rounded-lg mt-4"
                type="submit"
              >
                Adicionar cartão
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}