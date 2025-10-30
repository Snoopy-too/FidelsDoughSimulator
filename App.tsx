import React, { useState } from 'react';
import { ParameterControls } from './components/ParameterControls';
import { SimulationDisplay } from './components/SimulationDisplay';
import { useDoughSimulation, calculateIdyFromDoublingTime } from './hooks/useDoughSimulation';
import type { SimulationParams } from './types';

const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    idy: 0.5,
    salt: 2.8,
    hydration: 63,
    temperature: 24,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [flourAmountKg, setFlourAmountKg] = useState(1); // Default to 1kg
  const [targetDoublingTime, setTargetDoublingTime] = useState<number | null>(null);

  const availableSpeeds = [1, 5, 10, 25, 50, 100];
  const [speedIndex, setSpeedIndex] = useState(0);
  const simulationSpeed = availableSpeeds[speedIndex];

  const { elapsedMinutes, volume, isCollapsed, milestones, doublingTimeMinutes, reset } = useDoughSimulation(params, isRunning, simulationSpeed, targetDoublingTime);

  const handleParamChange = (param: keyof SimulationParams, value: number) => {
    if (isRunning) return;
    setTargetDoublingTime(null); // When user manually changes a param, revert to calculating time.
    const clampedValue = Math.max(0, value); // Ensure no negative values
    setParams(prev => ({ ...prev, [param]: clampedValue }));
  };

  const handleFlourAmountChange = (newAmount: number) => {
    if (isRunning) return;
    // Clamp the value between 0.3 and 25 kg
    const clampedAmount = Math.max(0.3, Math.min(newAmount, 25));
    setFlourAmountKg(clampedAmount);
  };

  const handleDoublingTimeChange = (newTimeInMinutes: number) => {
    if (isRunning || newTimeInMinutes <= 0) return;

    setTargetDoublingTime(newTimeInMinutes); // Set the target time directly

    const newIdy = calculateIdyFromDoublingTime(
      newTimeInMinutes,
      params.salt,
      params.hydration,
      params.temperature
    );
    
    // Clamp the new IDY to the allowed range from the input (0.003 to 3)
    const clampedIdy = Math.max(0.003, Math.min(newIdy, 3));

    setParams(prev => ({ ...prev, idy: clampedIdy }));
  };

  const handleToggleRun = () => {
    if (isCollapsed) return;
    setIsRunning(prev => !prev);
  };
  
  const handleSpeedChange = (direction: 'increase' | 'decrease') => {
    if (direction === 'increase') {
      setSpeedIndex(prevIndex => Math.min(prevIndex + 1, availableSpeeds.length - 1));
    } else {
      setSpeedIndex(prevIndex => Math.max(prevIndex - 1, 0));
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSpeedIndex(0); // Reset speed to 1x
    setTargetDoublingTime(null); // Clear target time on reset
    reset();
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Neapolitan Pizza Dough Fermentation Simulator
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Model your Neapolitan pizza dough proofing based on your recipe.
        </p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:order-2">
          <SimulationDisplay 
            volume={volume}
            isCollapsed={isCollapsed}
            elapsedMinutes={elapsedMinutes}
            milestones={milestones}
          />
        </div>
        <div className="lg:order-1">
          <ParameterControls 
            params={params}
            onParamChange={handleParamChange}
            isRunning={isRunning}
            isCollapsed={isCollapsed}
            onToggleRun={handleToggleRun}
            onReset={handleReset}
            doublingTime={targetDoublingTime ?? doublingTimeMinutes}
            onDoublingTimeChange={handleDoublingTimeChange}
            simulationSpeed={simulationSpeed}
            onSpeedChange={handleSpeedChange}
            isMinSpeed={speedIndex === 0}
            isMaxSpeed={speedIndex === availableSpeeds.length - 1}
            flourAmountKg={flourAmountKg}
            onFlourAmountChange={handleFlourAmountChange}
          />
        </div>
      </main>

      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>Formula based on Fidel's fermentation models.</p>
      </footer>
    </div>
  );
};

export default App;