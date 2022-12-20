import { useEffect, useRef } from 'react';

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const currentPoint = computePointInCanvas(e);

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx || !currentPoint) return;
    };

    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    };
    //Add event listeners
    canvasRef.current?.addEventListener('mousemove', handler);

    return () => {
      //Remove event listeners on cleanup
      canvasRef.current?.removeEventListener('mousemove', handler);
    };
  }, []);

  return { canvasRef };
};
