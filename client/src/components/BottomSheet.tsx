import { ReactNode, useRef, useEffect } from 'react';
import { useBottomSheet } from '@/hooks/useBottomSheet';

type BottomSheetProps = {
  children: ReactNode;
  expanded: boolean;
  onToggle: () => void;
};

export default function BottomSheet({ children, expanded, onToggle }: BottomSheetProps) {
  const { handleRef, sheetRef, handleTouchStart, handleMouseDown } = useBottomSheet({
    onStateChange: (isExpanded) => {
      if (isExpanded !== expanded) {
        onToggle();
      }
    },
    initialState: expanded,
  });

  useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = expanded ? 'translateY(0)' : 'translateY(70%)';
    }
  }, [expanded]);

  return (
    <div 
      ref={sheetRef}
      className="bottom-sheet fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-2xl shadow-lg z-20 transition-transform duration-300 md:w-[400px] md:right-auto md:ml-4 md:mb-4 md:rounded-2xl"
    >
      <div 
        ref={handleRef}
        className="sheet-handle dark:bg-zinc-700 cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
      ></div>
      <div className="custom-scrollbar overflow-y-auto max-h-[80vh]">
        {children}
      </div>
    </div>
  );
}
