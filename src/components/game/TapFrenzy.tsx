import React from 'react';
import { useGame } from '@/hooks/useGame';
import { Target } from './Target';
import { Particle } from './Particle';
import { ScorePopup } from './ScorePopup';
import { GameHUD } from './GameHUD';
import { StartScreen } from './StartScreen';
import { GameOver } from './GameOver';
import { cn } from '@/lib/utils';

export const TapFrenzy: React.FC = () => {
  const {
    gameState,
    score,
    highScore,
    lives,
    maxLives,
    combo,
    streak,
    targets,
    scorePopups,
    particles,
    shake,
    isNewHighScore,
    difficultyLevel,
    containerRef,
    startGame,
    hitTarget,
  } = useGame();

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-screen overflow-hidden animated-bg select-none',
        shake && 'screen-shake'
      )}
    >
      {/* Background grid effect */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Game HUD */}
      {gameState === 'playing' && (
        <GameHUD
          score={score}
          highScore={highScore}
          combo={combo}
          streak={streak}
          lives={lives}
          maxLives={maxLives}
          difficultyLevel={difficultyLevel}
        />
      )}

      {/* Targets */}
      {targets.map((target) => (
        <Target
          key={target.id}
          id={target.id}
          x={target.x}
          y={target.y}
          size={target.size}
          color={target.color}
          onClick={hitTarget}
          timeLeft={target.lifetime - (Date.now() - target.createdAt)}
          maxTime={target.lifetime}
        />
      ))}

      {/* Score popups */}
      {scorePopups.map((popup) => (
        <ScorePopup
          key={popup.id}
          x={popup.x}
          y={popup.y}
          points={popup.points}
          combo={popup.combo}
        />
      ))}

      {/* Particles */}
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          color={particle.color}
          tx={particle.tx}
          ty={particle.ty}
        />
      ))}

      {/* Start Screen */}
      {gameState === 'start' && (
        <StartScreen highScore={highScore} onStart={startGame} />
      )}

      {/* Game Over */}
      {gameState === 'gameOver' && (
        <GameOver
          score={score}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          onRestart={startGame}
        />
      )}
    </div>
  );
};
