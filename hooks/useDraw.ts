import { useEffect, useRef, useState } from 'react';

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void
) => {
  const [mouseDown, setMouseDown] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<null | Point>(null);

  const onMouseDown = () => setMouseDown(true);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvasRef.current?.getContext('2d');

    if(!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!mouseDown) {
        return;
      }
      const currentPoint = computePointInCanvas(e);

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx || !currentPoint) return;

      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
      prevPoint.current = currentPoint;
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
    window.addEventListener('mouseup', () => {
      setMouseDown(false);
      prevPoint.current = null;
    });

    return () => {
      //Remove event listeners on cleanup
      canvasRef.current?.removeEventListener('mousemove', handler);
      window.removeEventListener('mouseup', () => setMouseDown(false));
    };
  }, [onDraw]);

  return { canvasRef, onMouseDown, clear };
};
