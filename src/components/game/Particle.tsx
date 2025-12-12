import React from 'react';

interface ParticleProps {
  x: number;
  y: number;
  color: string;
  tx: number;
  ty: number;
}

export const Particle: React.FC<ParticleProps> = ({ x, y, color, tx, ty }) => {
  return (
    <div
      className="particle"
      style={{
        left: x,
        top: y,
        width: 8,
        height: 8,
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}`,
        '--tx': `${tx}px`,
        '--ty': `${ty}px`,
      } as React.CSSProperties}
    />
  );
};
