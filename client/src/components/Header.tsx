import { Link } from "wouter";
import { useTheme } from "@/lib/ThemeProvider";
import { Button } from "@/components/ui/button";

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
          <span className="material-icons text-primary dark:text-white mr-2">pedal_bike</span>
          <h1 className="text-xl font-semibold text-primary dark:text-white">BikeShare SP</h1>
        </div>
      </Link>
      
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          className="mr-4 text-zinc-800 dark:text-white"
        >
          <span className="material-icons dark:hidden">dark_mode</span>
          <span className="material-icons hidden dark:inline">light_mode</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onProfileClick} 
          className="text-zinc-800 dark:text-white"
        >
          <span className="material-icons">account_circle</span>
        </Button>
      </div>
    </header>
  );
}
