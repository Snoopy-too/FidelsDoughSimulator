import { useState, useEffect, useMemo, useCallback } from 'react';
import type { SimulationParams, Milestone } from '../types';

const SIMULATION_INTERVAL_MS = 100; // Each interval is 100ms of real time
const SIMULATED_MINUTES_PER_BASE_INTERVAL = 1; // Represents 1 minute of simulated fermentation time at 1x speed

export const useDoughSimulation = (
  params: SimulationParams,
  isRunning: boolean,
  simulationSpeed: number,
  targetDoublingTimeMinutes?: number | null
) => {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const calculatedDoublingTimeMinutes = useMemo(() => {
    const { idy, salt, hydration, temperature } = params;
    if (idy <= 0 || hydration <= 0) return Infinity;

    // Yeast strength increased 5x as requested by changing the leading coefficient from 2 to 0.4.
    const tdHours =
      (0.4 / idy) *
      Math.pow(2, (30 - temperature) / 10) *
      (60 / hydration) *
      (1 + 0.05 * salt);
    
    return tdHours * 60;
  }, [params]);

  const doublingTimeMinutes = targetDoublingTimeMinutes ?? calculatedDoublingTimeMinutes;

  const reset = useCallback(() => {
    setElapsedMinutes(0);
    setVolume(1);
    setIsCollapsed(false);
    setMilestones([]);
  }, []);

  const addMilestone = (milestones: Milestone[], label: string, time: number): Milestone[] => {
    if (milestones.some(m => m.label === label)) return milestones;
    return [...milestones, { id: Date.now(), label, time }];
  };

  useEffect(() => {
    if (!isRunning || isCollapsed || doublingTimeMinutes === Infinity) {
      return;
    }

    const intervalId = setInterval(() => {
      setElapsedMinutes(prevMinutes => {
        const simulatedMinutesPerInterval = SIMULATED_MINUTES_PER_BASE_INTERVAL * simulationSpeed;
        const newMinutes = prevMinutes + simulatedMinutesPerInterval;
        const newVolume = Math.pow(2, newMinutes / doublingTimeMinutes);
        
        setVolume(newVolume);

        const shouldCollapse = newVolume >= 3.5 || (doublingTimeMinutes > 0 && newMinutes > 6 * doublingTimeMinutes);
        
        if (shouldCollapse) {
          setIsCollapsed(true);
          setMilestones(prev => addMilestone(prev, 'Collapsed', newMinutes));
        } else {
          setMilestones(prev => {
            let next = [...prev];
            if (newVolume >= 2) {
              next = addMilestone(next, 'Doubled', newMinutes);
            }
            if (newVolume >= 3) {
              next = addMilestone(next, 'Tripled', newMinutes);
            }
            return next;
          });
        }
        
        return newMinutes;
      });
    }, SIMULATION_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isRunning, isCollapsed, doublingTimeMinutes, simulationSpeed]);

  return { elapsedMinutes, volume, isCollapsed, milestones, doublingTimeMinutes, reset };
};

export const calculateIdyFromDoublingTime = (
  doublingTimeMinutes: number,
  salt: number,
  hydration: number,
  temperature: number
): number => {
  if (doublingTimeMinutes <= 0 || hydration <= 0) return 0;

  const tdHours = doublingTimeMinutes / 60;

  const factors =
    Math.pow(2, (30 - temperature) / 10) *
    (60 / hydration) *
    (1 + 0.05 * salt);
  
  const idy = (0.4 * factors) / tdHours;
  
  // Return a sensible precision, e.g., 4 decimal places
  return parseFloat(idy.toFixed(4));
};