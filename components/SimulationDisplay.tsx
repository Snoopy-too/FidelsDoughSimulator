import React from 'react';
import type { Milestone } from '../types';

interface DoughBallProps {
  scale: number;
  isCollapsed: boolean;
}

const DoughBall: React.FC<DoughBallProps> = ({ scale, isCollapsed }) => {
  const visualScale = Math.cbrt(scale); // Use cubic root for 3D volume representation
  
  return (
    <div className="relative w-56 h-48 sm:w-80 sm:h-64 flex items-end justify-center">
      {/* Base surface line */}
      <div className="absolute bottom-[24%] w-[120%] h-0.5 bg-gray-700/50 rounded-full" />
      
      {/* Shadow for starting size - dome shape. Positioned on the "surface" */}
      <div 
        className="absolute w-40 h-20 sm:w-56 sm:h-28 bottom-[24%] rounded-t-full border-2 border-b-0 border-dashed border-green-500 z-10"
      />
      
      {/* Growing dough ball - dome shape */}
      <div 
        className={`absolute w-40 h-20 sm:w-56 sm:h-28 bottom-[24%] rounded-t-full bg-[#f3d9b1] shadow-2xl transition-transform duration-500 ease-out
          ${isCollapsed ? 'bg-[#d1b894] shadow-none' : ''}`}
        style={{ 
          transformOrigin: 'bottom',
          transform: isCollapsed ? 'scale(1.5, 0.4)' : `scale(${visualScale})`,
        }}
      ></div>
    </div>
  );
};

interface ClockProps {
    elapsedMinutes: number;
}

const Clock: React.FC<ClockProps> = ({ elapsedMinutes }) => {
    const hours = Math.floor(elapsedMinutes / 60);
    const minutes = Math.floor(elapsedMinutes % 60);
    
    return (
        <div className="absolute top-4 right-4 bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700">
            <span className="font-mono text-2xl tracking-wider text-white">
                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
            </span>
        </div>
    );
};

interface MilestoneLogProps {
    milestones: Milestone[];
}

const MilestoneLog: React.FC<MilestoneLogProps> = ({ milestones }) => {
    const formatTime = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = Math.floor(minutes % 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    return (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 text-sm space-y-2">
            {milestones.map(milestone => (
                <div key={milestone.id} className="flex items-center justify-end animate-fade-in">
                     <div className="bg-gray-900/70 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700 flex items-center space-x-2">
                        <span className={`font-bold ${milestone.label === 'Collapsed' ? 'text-red-400' : 'text-green-400'}`}>
                            {milestone.label}
                        </span>
                        <span className="text-gray-400">at {formatTime(milestone.time)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};


interface SimulationDisplayProps {
  volume: number;
  isCollapsed: boolean;
  elapsedMinutes: number;
  milestones: Milestone[];
}

export const SimulationDisplay: React.FC<SimulationDisplayProps> = ({ volume, isCollapsed, elapsedMinutes, milestones }) => {
  return (
    <div className="relative flex items-center justify-center w-full min-h-[400px] sm:min-h-[500px] bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <DoughBall scale={volume} isCollapsed={isCollapsed} />
      <Clock elapsedMinutes={elapsedMinutes} />
      <MilestoneLog milestones={milestones} />
    </div>
  );
};