import { useState, useRef, useCallback } from 'react';

const PULL_THRESHOLD = 80;
const RESISTANCE = 0.5;

const PullToRefresh = ({ onRefresh, children, disabled = false }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const handleTouchStart = useCallback(
    (e) => {
      if (disabled) return;
      startY.current = e.touches[0].clientY;
      scrollTop.current = window.scrollY ?? document.documentElement.scrollTop;
    },
    [disabled]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (disabled || isRefreshing) return;
      const scrollY = window.scrollY ?? document.documentElement.scrollTop;
      if (scrollY > 0) return;

      const currentY = e.touches[0].clientY;
      const delta = currentY - startY.current;
      if (delta > 0) {
        const resisted = Math.min(delta * RESISTANCE, PULL_THRESHOLD);
        setPullDistance(resisted);
      }
    },
    [disabled, isRefreshing]
  );

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= PULL_THRESHOLD && onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(0);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, onRefresh, isRefreshing]);

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Pull indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="flex justify-center items-center py-2 text-gray-500 text-sm transition-opacity"
          style={{
            height: Math.max(pullDistance, 48),
            opacity: isRefreshing ? 1 : Math.min(pullDistance / PULL_THRESHOLD, 1),
          }}
        >
          {isRefreshing ? (
            <span>Refreshing...</span>
          ) : pullDistance >= PULL_THRESHOLD ? (
            <span>Release to refresh</span>
          ) : (
            <span>Pull to refresh</span>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default PullToRefresh;
