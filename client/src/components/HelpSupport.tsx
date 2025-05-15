import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type HelpSupportProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HelpSupport({ isOpen, onClose }: HelpSupportProps) {
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
          <h2 className="text-2xl font-semibold">Ajuda & Suporte</h2>
          <button className="text-zinc-800 dark:text-white" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-3">Contato</h3>
            <div className="grid gap-3">
              <div className="flex items-center">
                <span className="material-icons mr-3 text-gray-600 dark:text-gray-300">phone</span>
                <span>(11) 4002-8922</span>
              </div>
              <div className="flex items-center">
                <span className="material-icons mr-3 text-gray-600 dark:text-gray-300">email</span>
                <span>suporte@bikesharesp.com</span>
              </div>
              <div className="flex items-center">
                <span className="material-icons mr-3 text-gray-600 dark:text-gray-300">schedule</span>
                <span>Seg-Sex: 8h-20h / Sáb: 9h-15h</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Perguntas Frequentes</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  Como faço para alugar uma bicicleta?
                </AccordionTrigger>
                <AccordionContent>
                  Para alugar uma bicicleta, você precisa localizar uma estação próxima no mapa, selecionar a estação e escolher uma bicicleta disponível. Depois é só confirmar o aluguel e a bicicleta será liberada automaticamente.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  Como funciona a cobrança do serviço?
                </AccordionTrigger>
                <AccordionContent>
                  A cobrança é realizada por tempo de uso. Você pode escolher entre planos diários, semanais ou mensais. Também temos a opção de pagamento por uso, onde você paga apenas pelo tempo utilizado.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  O que fazer se a bicicleta apresentar defeito?
                </AccordionTrigger>
                <AccordionContent>
                  Se a bicicleta apresentar qualquer problema durante o uso, você deve encerrar o aluguel na estação mais próxima e reportar o problema pelo aplicativo ou entrar em contato com o suporte. Você será reembolsado pelo tempo não utilizado.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  Posso reservar uma bicicleta com antecedência?
                </AccordionTrigger>
                <AccordionContent>
                  Sim, é possível reservar uma bicicleta com até 15 minutos de antecedência. Após esse período, se a bicicleta não for retirada, a reserva é cancelada automaticamente.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  Como funciona o programa de fidelidade?
                </AccordionTrigger>
                <AccordionContent>
                  A cada aluguel completado, você acumula pontos que podem ser trocados por dias gratuitos de uso ou descontos em planos futuros. Você também ganha pontos ao convidar amigos para usar o serviço.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="font-medium text-lg mb-3">Fale Conosco</h3>
            <form className="space-y-3">
              <div>
                <label htmlFor="subject" className="block mb-1">Assunto</label>
                <Input id="subject" placeholder="Selecione um assunto" />
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-1">Mensagem</label>
                <Textarea
                  id="message"
                  placeholder="Descreva seu problema ou dúvida em detalhes"
                  rows={4}
                />
              </div>
              
              <Button 
                className="w-full bg-secondary hover:bg-secondary/90 text-white py-2 rounded-lg"
                type="submit"
              >
                Enviar mensagem
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}