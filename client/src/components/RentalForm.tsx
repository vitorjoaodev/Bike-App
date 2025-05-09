import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Animações para os ícones de bicicleta
const bikeVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      type: 'spring',
      stiffness: 200,
      damping: 10
    }
  })
};

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.4,
      type: 'tween',
      ease: 'easeOut'
    }
  }
};

const submitButtonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

const rentalFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  phone: z.string().min(10, { message: 'Telefone inválido' }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Você precisa aceitar os termos'
  }),
  smsNotification: z.boolean().optional(),
  emailNotification: z.boolean().optional(),
});

type RentalFormValues = z.infer<typeof rentalFormSchema>;

interface RentalFormProps {
  onSubmit: (data: RentalFormValues) => void;
  onCancel: () => void;
}

export default function RentalForm({ onSubmit, onCancel }: RentalFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RentalFormValues>({
    resolver: zodResolver(rentalFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      acceptTerms: false,
      smsNotification: false,
      emailNotification: true,
    },
  });

  const handleSubmit = async (values: RentalFormValues) => {
    setIsSubmitting(true);
    
    // Simular animação de envio
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(values);
      
      toast({
        title: 'Dados enviados com sucesso!',
        description: 'Seu aluguel está sendo processado.',
      });
    }, 1500);
  };

  // Array de bicicletas para animação decorativa
  const bikeTypes = [
    { icon: "pedal_bike", title: "Urbana" },
    { icon: "electric_bike", title: "Elétrica" },
    { icon: "directions_bike", title: "Montanha" }
  ];

  return (
    <motion.div 
      className="p-5 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <h2 className="text-xl font-semibold mb-2 text-secondary">Complete seu cadastro</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Preencha os dados abaixo para confirmar o aluguel da bicicleta
      </p>
      
      {/* Elementos decorativos de bicicleta animados */}
      <div className="flex justify-between mb-8">
        {bikeTypes.map((bike, i) => (
          <motion.div 
            key={i}
            className="flex flex-col items-center"
            custom={i}
            variants={bikeVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={`w-14 h-14 rounded-full ${i === 1 ? 'bg-secondary' : 'bg-gray-100 dark:bg-gray-700'} 
                 flex items-center justify-center text-${i === 1 ? 'white' : 'secondary'} shadow-md`}>
              <span className="material-icons text-2xl">{bike.icon}</span>
            </div>
            <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">{bike.title}</span>
          </motion.div>
        ))}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite seu nome completo" 
                    {...field} 
                    className="rounded-lg border-gray-200 dark:border-gray-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite seu email" 
                    type="email" 
                    {...field} 
                    className="rounded-lg border-gray-200 dark:border-gray-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(00) 00000-0000" 
                    {...field} 
                    className="rounded-lg border-gray-200 dark:border-gray-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-3 pt-2">
            <FormField
              control={form.control}
              name="smsNotification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Quero receber atualizações por SMS
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="emailNotification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Quero receber atualizações por Email
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Aceito os termos e condições de uso
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            
            <motion.div 
              className="flex-1"
              variants={submitButtonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                type="submit" 
                className="w-full bg-secondary hover:bg-secondary/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-icons animate-spin mr-2">sync</span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-2">check_circle</span>
                    Confirmar
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}