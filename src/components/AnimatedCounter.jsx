import React, { useState, useEffect, useRef } from 'react';

export const AnimatedCounter = ({ 
  value, 
  prefix = '', 
  suffix = '', 
  decimals = 0,
  duration = 1200 
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const startTime = performance.now();
          const startValue = 0;
          const endValue = numericValue;

          const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Ease out cubic function for smooth deceleration
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = startValue + (endValue - startValue) * easeOutProgress;

            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(endValue);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [numericValue, duration, hasAnimated]);

  // Format value cleanly
  const formattedCount = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.round(count).toLocaleString('en-IN');

  return (
    <span ref={ref} className="animated-counter-num">
      {prefix}{formattedCount}{suffix}
    </span>
  );
};
