import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to monitor user workstation inactivity
 * Inactivity window: 15 minutes (900,000 ms)
 * Warning window: Triggered at 13 minutes (2-minute grace period countdown)
 */
export const useInactivityTimeout = ({
  isAuthenticated = false,
  onTimeout,
  timeoutMs = 15 * 60 * 1000,
  warningMs = 13 * 60 * 1000
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(120);

  const lastActivityRef = useRef(Date.now());
  const warningIntervalRef = useRef(null);
  const checkIntervalRef = useRef(null);

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (showWarning) {
      setShowWarning(false);
      setRemainingSeconds(120);
      if (warningIntervalRef.current) {
        clearInterval(warningIntervalRef.current);
        warningIntervalRef.current = null;
      }
    }
  }, [showWarning]);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowWarning(false);
      if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      return;
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleUserInteraction = () => {
      // Only auto-reset if warning modal is not currently open
      if (!showWarning) {
        lastActivityRef.current = Date.now();
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserInteraction, { passive: true });
    });

    // Check inactivity status every 5 seconds
    checkIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;

      if (elapsed >= timeoutMs) {
        // Expired: log out immediately
        setShowWarning(false);
        if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        if (onTimeout) onTimeout();
      } else if (elapsed >= warningMs && !showWarning) {
        // Trigger grace period countdown
        setShowWarning(true);
        const remaining = Math.max(0, Math.ceil((timeoutMs - elapsed) / 1000));
        setRemainingSeconds(remaining);

        if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
        warningIntervalRef.current = setInterval(() => {
          setRemainingSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(warningIntervalRef.current);
              warningIntervalRef.current = null;
              if (onTimeout) onTimeout();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }, 5000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction);
      });
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
    };
  }, [isAuthenticated, showWarning, onTimeout, timeoutMs, warningMs]);

  return {
    showWarning,
    remainingSeconds,
    resetActivity
  };
};
