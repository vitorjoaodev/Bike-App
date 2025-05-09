import { Link } from "wouter";
import { useTheme } from "@/lib/ThemeProvider";
import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/NotificationBell";

type HeaderProps = {
  onProfileClick: () => void;
};

export default function Header({ onProfileClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-zinc-900 shadow-md z-10 px-4 py-3 flex justify-between items-center">
      <Link href="/">
        <div className="flex items-center cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-2 shadow-lg">
            <span className="material-icons text-white">pedal_bike</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-primary dark:text-white">BikeShare SP</h1>
            <p className="text-xs text-secondary hidden md:block">Aluguel de Bicicletas</p>
          </div>
        </div>
      </Link>
      
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          className="text-zinc-800 dark:text-white"
        >
          <span className="material-icons dark:hidden">dark_mode</span>
          <span className="material-icons hidden dark:inline">light_mode</span>
        </Button>
        
        <NotificationBell />
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onProfileClick} 
          className="text-zinc-800 dark:text-white relative"
        >
          <span className="material-icons">account_circle</span>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white dark:border-zinc-900"></span>
        </Button>
      </div>
    </header>
  );
}
