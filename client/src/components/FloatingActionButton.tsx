import { ButtonHTMLAttributes } from 'react';

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
}

export default function FloatingActionButton({ icon, className, ...props }: FloatingActionButtonProps) {
  return (
    <button
      className={`fixed right-4 bottom-32 md:bottom-24 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white shadow-lg rounded-full p-3 z-10 ${className || ''}`}
      {...props}
    >
      <span className="material-icons">{icon}</span>
    </button>
  );
}
