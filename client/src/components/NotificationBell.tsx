import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: Date;
  read: boolean;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  
  // Simulate notification data
  useEffect(() => {
    // Example notifications
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: 'Aluguel confirmado',
        message: 'Seu aluguel de bicicleta na Estação Paulista foi confirmado.',
        type: 'success',
        createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        read: false
      },
      {
        id: 2,
        title: 'Oferta especial',
        message: 'Ganhe 20% de desconto no seu próximo aluguel semanal!',
        type: 'info',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        read: false
      },
      {
        id: 3,
        title: 'Lembrete de devolução',
        message: 'Sua bicicleta deve ser devolvida em 1 hora.',
        type: 'warning',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };
  
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': 
      default: return 'info';
    }
  };
  
  const getColorForType = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'text-secondary bg-secondary bg-opacity-10';
      case 'warning': return 'text-amber-500 bg-amber-500 bg-opacity-10';
      case 'error': return 'text-destructive bg-destructive bg-opacity-10';
      case 'info': 
      default: return 'text-accent bg-accent bg-opacity-10';
    }
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <span className="material-icons">notifications</span>
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-secondary text-white text-xs" 
              variant="default"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notificações</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8"
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <span className="material-icons text-4xl mb-2">notifications_off</span>
              <p>Sem notificações</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 border-b hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer ${notification.read ? 'opacity-70' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex">
                  <div className={`w-10 h-10 rounded-full ${getColorForType(notification.type)} flex items-center justify-center mr-3`}>
                    <span className="material-icons">{getIconForType(notification.type)}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-secondary self-start mt-2"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-2 text-center border-t">
          <Button variant="ghost" size="sm" className="text-xs w-full" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}