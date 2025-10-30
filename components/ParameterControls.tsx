import React, { useState, useEffect } from 'react';
import type { SimulationParams } from '../types';

interface ParameterInputProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const ParameterInput: React.FC<ParameterInputProps> = ({ label, unit, value, min, max, step, onChange, disabled }) => (
  <div className="flex flex-col">
    <label className="mb-2 text-sm font-medium text-gray-400">{label}</label>
    <div className="flex items-center bg-gray-800 border border-gray-700 rounded-md">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        disabled={disabled}
        className="w-full p-2 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <span className="px-3 text-gray-400">{unit}</span>
    </div>
  </div>
);

interface TemperatureSliderProps {
  value: number;
  unit: 'C' | 'F';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  onUnitToggle: () => void;
}

const TemperatureSlider: React.FC<TemperatureSliderProps> = ({ value, unit, onChange, disabled, onUnitToggle }) => {
  const min = unit === 'C' ? 2 : Math.round((2 * 9/5) + 32); // 36°F
  const max = unit === 'C' ? 38 : Math.round((38 * 9/5) + 32); // 100°F

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-400">Temperature</label>
        <div className="flex items-center p-1 bg-gray-900 rounded-full border border-gray-700">
          <button
            onClick={unit === 'F' ? onUnitToggle : undefined}
            disabled={disabled}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${unit === 'C' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            °C
          </button>
          <button
            onClick={unit === 'C' ? onUnitToggle : undefined}
            disabled={disabled}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${unit === 'F' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            °F
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="range"
          min={min}
          max={max}
          step="1"
          value={Math.round(value)}
          onChange={onChange}
          disabled={disabled}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span className="font-mono text-lg w-20 text-center">{Math.round(value)}°{unit}</span>
      </div>
    </div>
  );
};

interface DoublingTimeInputProps {
  totalMinutes: number;
  onChange: (totalMinutes: number) => void;
  disabled: boolean;
}

const DoublingTimeInput: React.FC<DoublingTimeInputProps> = ({ totalMinutes, onChange, disabled }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    if (totalMinutes === Infinity || isNaN(totalMinutes) || totalMinutes < 0) {
      setHours(0);
      setMinutes(0);
      return;
    }
    const roundedTotalMinutes = Math.round(totalMinutes);
    setHours(Math.floor(roundedTotalMinutes / 60));
    setMinutes(roundedTotalMinutes % 60);
  }, [totalMinutes]);
  
  const handleSubmit = () => {
    const newTotalMinutes = (hours * 60) + minutes;
    // Check if the value has actually changed to avoid redundant updates
    if (Math.round(newTotalMinutes) !== Math.round(totalMinutes)) {
      onChange(newTotalMinutes);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
      e.currentTarget.blur();
    }
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHours(parseInt(e.target.value, 10) || 0);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinutes(parseInt(e.target.value, 10) || 0);
  };
  
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-gray-400">Set Doubling Time (adjusts IDY)</label>
      <div className="flex items-center space-x-2 bg-gray-900 p-2 rounded-md">
        <input 
          type="number"
          value={hours}
          min="0"
          onChange={handleHoursChange}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <span className="text-gray-400">h</span>
        <input
          type="number"
          value={minutes}
          min="0"
          max="59"
          onChange={handleMinutesChange}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <span className="text-gray-400">m</span>
      </div>
    </div>
  );
};


interface ParameterControlsProps {
  params: SimulationParams;
  onParamChange: (param: keyof SimulationParams, value: number) => void;
  isRunning: boolean;
  isCollapsed: boolean;
  onToggleRun: () => void;
  onReset: () => void;
  doublingTime: number;
  onDoublingTimeChange: (minutes: number) => void;
  simulationSpeed: number;
  onSpeedChange: (direction: 'increase' | 'decrease') => void;
  isMinSpeed: boolean;
  isMaxSpeed: boolean;
  flourAmountKg: number;
  onFlourAmountChange: (amount: number) => void;
  doughBallWeightGrams: number;
  onDoughBallWeightChange: (weight: number) => void;
  tempUnit: 'C' | 'F';
  onTempUnitToggle: () => void;
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({ 
  params, onParamChange, isRunning, isCollapsed, onToggleRun, onReset, 
  doublingTime, onDoublingTimeChange, simulationSpeed, onSpeedChange, 
  isMinSpeed, isMaxSpeed, flourAmountKg, onFlourAmountChange,
  doughBallWeightGrams, onDoughBallWeightChange,
  tempUnit, onTempUnitToggle
}) => {
  const [flourInputValue, setFlourInputValue] = useState(flourAmountKg.toString());
  const [ballWeightInputValue, setBallWeightInputValue] = useState(doughBallWeightGrams.toString());

  useEffect(() => {
    setFlourInputValue(flourAmountKg.toString());
  }, [flourAmountKg]);

  useEffect(() => {
    setBallWeightInputValue(doughBallWeightGrams.toString());
  }, [doughBallWeightGrams]);

  const handleInputChange = (param: keyof SimulationParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onParamChange(param, parseFloat(e.target.value));
  };

  const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const newTempInC = tempUnit === 'F' ? (value - 32) * 5 / 9 : value;
    onParamChange('temperature', newTempInC);
  };

  const handleFlourInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlourInputValue(e.target.value);
  };

  const handleFlourInputBlur = () => {
    const parsedValue = parseFloat(flourInputValue);
    if (!isNaN(parsedValue)) {
      onFlourAmountChange(parsedValue);
    } else {
      setFlourInputValue(flourAmountKg.toString());
    }
  };
  
  const handleFlourInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFlourInputBlur();
      e.currentTarget.blur();
    }
  };

  const handleBallWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBallWeightInputValue(e.target.value);
  };

  const handleBallWeightBlur = () => {
    const parsedValue = parseInt(ballWeightInputValue, 10);
    if (!isNaN(parsedValue)) {
      onDoughBallWeightChange(parsedValue);
    } else {
      setBallWeightInputValue(doughBallWeightGrams.toString());
    }
  };
  
  const handleBallWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBallWeightBlur();
      e.currentTarget.blur();
    }
  };


  const flourGrams = flourAmountKg * 1000;
  const waterGrams = flourGrams * (params.hydration / 100);
  const saltGrams = flourGrams * (params.salt / 100);
  const idyGrams = flourGrams * (params.idy / 100);
  const totalDoughWeight = flourGrams + waterGrams + saltGrams + idyGrams;
  const doughBallYield = doughBallWeightGrams > 0 ? (totalDoughWeight / doughBallWeightGrams).toFixed(1) : '0.0';

  const displayTemp = tempUnit === 'F' ? (params.temperature * 9 / 5) + 32 : params.temperature;

  return (
    <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg space-y-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white">Fermentation Parameters</h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ParameterInput label="Instant Dry Yeast" unit="%" value={params.idy} min={0.003} max={3} step={0.001} onChange={handleInputChange('idy')} disabled={isRunning} />
        <ParameterInput label="Salt" unit="%" value={params.salt} min={0} max={3} step={0.1} onChange={handleInputChange('salt')} disabled={isRunning} />
        <ParameterInput label="Hydration" unit="%" value={params.hydration} min={50} max={100} step={1} onChange={handleInputChange('hydration')} disabled={isRunning} />
      </div>
      
      <TemperatureSlider 
        value={displayTemp}
        unit={tempUnit}
        onChange={handleTempChange}
        disabled={isRunning}
        onUnitToggle={onTempUnitToggle}
      />

      <div className="pt-6 border-t border-gray-700 space-y-6">
        <h3 className="text-lg font-semibold text-white">Full Recipe Calculator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-400">Flour Amount</label>
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-md">
              <input
                type="number"
                value={flourInputValue}
                min={0.3}
                max={25}
                step={0.1}
                onChange={handleFlourInputChange}
                onBlur={handleFlourInputBlur}
                onKeyDown={handleFlourInputKeyDown}
                disabled={isRunning}
                className="w-full p-2 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-right pr-2"
              />
              <span className="px-3 text-gray-400">kg</span>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-400">Dough Ball Weight</label>
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-md">
              <input
                type="number"
                value={ballWeightInputValue}
                min="100"
                max="500"
                step="5"
                onChange={handleBallWeightChange}
                onBlur={handleBallWeightBlur}
                onKeyDown={handleBallWeightKeyDown}
                disabled={isRunning}
                className="w-full p-2 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-right pr-2"
              />
              <span className="px-3 text-gray-400">g</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <div className="font-medium text-gray-400">Flour:</div>
          <div className="font-mono text-right text-white">{flourGrams.toFixed(0)} g</div>

          <div className="font-medium text-gray-400">Water:</div>
          <div className="font-mono text-right text-white">{waterGrams.toFixed(0)} g</div>
          
          <div className="font-medium text-gray-400">Salt:</div>
          <div className="font-mono text-right text-white">{saltGrams.toFixed(1)} g</div>

          <div className="font-medium text-gray-400">IDY:</div>
          <div className="font-mono text-right text-white">{idyGrams.toFixed(1)} g</div>
        </div>
        <div className="text-center p-3 bg-blue-900/50 rounded-lg border border-blue-700">
          <p className="font-medium text-gray-300">
            Yields <span className="font-bold text-xl text-blue-300">{doughBallYield}</span> doughballs at <span className="font-bold">{doughBallWeightGrams}g</span>
          </p>
        </div>
      </div>


      <div className="pt-4 border-t border-gray-700 space-y-4">
        <DoublingTimeInput 
            totalMinutes={doublingTime}
            onChange={onDoublingTimeChange}
            disabled={isRunning}
        />
        <div className="flex items-center justify-between p-3 bg-gray-900 rounded-md">
            <span className="text-sm font-medium text-gray-400">Simulation Speed</span>
            <div className="flex items-center space-x-2">
                <button onClick={() => onSpeedChange('decrease')} disabled={isMinSpeed} className="px-3 py-1 font-bold text-white bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">-</button>
                <span className="font-mono text-lg w-14 text-center">{simulationSpeed}x</span>
                <button onClick={() => onSpeedChange('increase')} disabled={isMaxSpeed} className="px-3 py-1 font-bold text-white bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">+</button>
            </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleRun}
          disabled={isCollapsed || doublingTime === Infinity}
          className={`w-full py-3 px-4 font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
            ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900 focus:ring-yellow-400' : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'}
            ${(isCollapsed || doublingTime === Infinity) && 'bg-gray-600 cursor-not-allowed opacity-50'}`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={onReset}
          className="w-full py-3 px-4 font-semibold bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500"
        >
          Reset
        </button>
      </div>
    </div>
  );
};