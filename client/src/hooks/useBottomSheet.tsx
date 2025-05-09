import { useRef, useState, useEffect } from 'react';

type UseBottomSheetProps = {
  onStateChange?: (isExpanded: boolean) => void;
  initialState?: boolean;
};

export function useBottomSheet({ onStateChange, initialState = false }: UseBottomSheetProps = {}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(initialState);
  
  // Initial values for touch/mouse handling
  const startYRef = useRef<number>(0);
  const startTransformRef = useRef<number>(0);
  
  // Effect for initial state
  useEffect(() => {
    setIsExpanded(initialState);
  }, [initialState]);
  
  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    
    if (sheetRef.current) {
      const transformMatrix = window.getComputedStyle(sheetRef.current).transform;
      const matrix = new DOMMatrix(transformMatrix);
      startTransformRef.current = matrix.m42;
    }
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!sheetRef.current) return;
    
    const deltaY = e.touches[0].clientY - startYRef.current;
    const newTransform = Math.max(0, startTransformRef.current + deltaY);
    
    sheetRef.current.style.transform = `translateY(${newTransform}px)`;
  };
  
  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    
    if (!sheetRef.current) return;
    
    const sheetHeight = sheetRef.current.offsetHeight;
    const currentTransform = window.getComputedStyle(sheetRef.current).transform;
    const matrix = new DOMMatrix(currentTransform);
    const translateY = matrix.m42;
    
    // If the sheet is dragged more than 40% down, collapse it
    const shouldCollapse = translateY > sheetHeight * 0.4;
    
    if (shouldCollapse) {
      sheetRef.current.style.transform = 'translateY(70%)';
      setIsExpanded(false);
      onStateChange?.(false);
    } else {
      sheetRef.current.style.transform = 'translateY(0)';
      setIsExpanded(true);
      onStateChange?.(true);
    }
  };
  
  // Mouse event handlers (for desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    startYRef.current = e.clientY;
    
    if (sheetRef.current) {
      const transformMatrix = window.getComputedStyle(sheetRef.current).transform;
      const matrix = new DOMMatrix(transformMatrix);
      startTransformRef.current = matrix.m42;
    }
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!sheetRef.current) return;
    
    const deltaY = e.clientY - startYRef.current;
    const newTransform = Math.max(0, startTransformRef.current + deltaY);
    
    sheetRef.current.style.transform = `translateY(${newTransform}px)`;
  };
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    if (!sheetRef.current) return;
    
    const sheetHeight = sheetRef.current.offsetHeight;
    const currentTransform = window.getComputedStyle(sheetRef.current).transform;
    const matrix = new DOMMatrix(currentTransform);
    const translateY = matrix.m42;
    
    // If the sheet is dragged more than 40% down, collapse it
    const shouldCollapse = translateY > sheetHeight * 0.4;
    
    if (shouldCollapse) {
      sheetRef.current.style.transform = 'translateY(70%)';
      setIsExpanded(false);
      onStateChange?.(false);
    } else {
      sheetRef.current.style.transform = 'translateY(0)';
      setIsExpanded(true);
      onStateChange?.(true);
    }
  };
  
  return {
    sheetRef,
    handleRef,
    isExpanded,
    handleTouchStart,
    handleMouseDown,
  };
}
