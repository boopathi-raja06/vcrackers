import React, { useState, useEffect } from 'react';

const CrackersAnimation = ({ trigger = false, onComplete = () => {} }) => {
  const [explosions, setExplosions] = useState([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      createExplosions();
    }
  }, [trigger]);

  const createExplosions = () => {
    setIsActive(true);
    const newExplosions = [];
    
    // Create multiple explosion points
    for (let i = 0; i < 5; i++) {
      newExplosions.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: i * 200,
        particles: createParticles(30)
      });
    }
    
    setExplosions(newExplosions);
    
    // Clean up after animation
    setTimeout(() => {
      setExplosions([]);
      setIsActive(false);
      onComplete();
    }, 3000);
  };

  const createParticles = (count) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        id: i,
        angle: (360 / count) * i,
        distance: 50 + Math.random() * 100,
        size: 2 + Math.random() * 6,
        color: getRandomColor(),
        duration: 1 + Math.random() * 2
      });
    }
    return particles;
  };

  const getRandomColor = () => {
    const colors = [
      '#ff6b6b', '#ff8e53', '#ff6b9d', '#ffd93d', '#6bcf7f', 
      '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3',
      '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {explosions.map((explosion) => (
        <div
          key={explosion.id}
          className="absolute"
          style={{
            left: explosion.x,
            top: explosion.y,
            animationDelay: `${explosion.delay}ms`
          }}
        >
          {/* Central flash */}
          <div
            className="absolute w-8 h-8 rounded-full bg-white animate-ping opacity-75"
            style={{
              transform: 'translate(-50%, -50%)',
              animationDuration: '0.5s'
            }}
          />
          
          {/* Particles */}
          {explosion.particles.map((particle) => {
            const angleRad = particle.angle * Math.PI / 180;
            const translateX = Math.cos(angleRad) * particle.distance;
            const translateY = Math.sin(angleRad) * particle.distance;
            
            return (
              <div
                key={particle.id}
                className="absolute rounded-full animate-pulse"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  transform: 'translate(-50%, -50%)',
                  animation: `cracker-particle ${particle.duration}s ease-out forwards`,
                  '--translate-x': `${translateX}px`,
                  '--translate-y': `${translateY}px`
                }}
              />
            );
          })}
        </div>
      ))}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes cracker-particle {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) translate(var(--translate-x), var(--translate-y)) scale(0);
              opacity: 0;
            }
          }
        `
      }} />
    </div>
  );
};

// Ambient crackers animation for background
const AmbientCrackersAnimation = () => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    console.log('AmbientCrackersAnimation mounted');
    
    const createSparkle = () => {
      if (typeof window === 'undefined') return;
      
      const newSparkle = {
        id: Date.now() + Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        color: getRandomSparkleColor(),
        size: 6 + Math.random() * 12, // Made even bigger for visibility
        duration: 2 + Math.random() * 2
      };

      console.log('Creating sparkle:', newSparkle);
      setSparkles(prev => [...prev, newSparkle]);

      // Remove sparkle after animation
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
      }, newSparkle.duration * 1000);
    };

    const getRandomSparkleColor = () => {
      const colors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#ff6b6b', '#ffd93d'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // Create initial sparkles immediately
    for (let i = 0; i < 5; i++) {
      setTimeout(createSparkle, i * 500);
    }
    
    // Create sparkles periodically
    const interval = setInterval(createSparkle, 1500);
    
    return () => clearInterval(interval);
  }, []);

  console.log('Rendering sparkles:', sparkles.length);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full animate-ping opacity-90"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: sparkle.color,
            animationDuration: `${sparkle.duration}s`,
            boxShadow: `0 0 ${sparkle.size * 3}px ${sparkle.color}`,
            border: `2px solid ${sparkle.color}`
          }}
        />
      ))}
      
      {/* Debug info */}
      <div className="fixed bottom-4 left-4 bg-black text-white text-xs p-2 rounded opacity-75">
        Sparkles: {sparkles.length}
      </div>
    </div>
  );
};

// Firework trails animation
const FireworkTrails = ({ isActive = true }) => {
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    if (!isActive || typeof window === 'undefined') return;

    const createTrail = () => {
      const newTrail = {
        id: Date.now() + Math.random(),
        startX: Math.random() * window.innerWidth,
        startY: window.innerHeight + 50,
        endY: Math.random() * (window.innerHeight / 2) + 100,
        color: getRandomTrailColor(),
        duration: 2 + Math.random() * 1
      };

      setTrails(prev => [...prev, newTrail]);

      setTimeout(() => {
        setTrails(prev => prev.filter(t => t.id !== newTrail.id));
      }, newTrail.duration * 1000);
    };

    const getRandomTrailColor = () => {
      const colors = ['#ff6b6b', '#ffd93d', '#4ecdc4', '#ff9f43', '#96ceb4', '#45b7d1', '#feca57'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // Create initial trail immediately
    setTimeout(createTrail, 2000);
    
    const interval = setInterval(createTrail, 4000); // More frequent
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {trails.map((trail) => {
        const distance = trail.startY - trail.endY;
        return (
          <div
            key={trail.id}
            className="absolute rounded-full opacity-90"
            style={{
              left: trail.startX,
              top: trail.startY,
              width: '4px',
              height: '80px',
              background: `linear-gradient(to top, ${trail.color}, ${trail.color}80, transparent)`,
              animation: `trail-move ${trail.duration}s ease-out forwards`,
              '--distance': `-${distance}px`,
              boxShadow: `0 0 10px ${trail.color}`
            }}
          />
        );
      })}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes trail-move {
            0% {
              transform: translateY(0) scaleY(1);
              opacity: 0.9;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(var(--distance)) scaleY(0.2);
              opacity: 0;
            }
          }
        `
      }} />
    </div>
  );
};

export { CrackersAnimation, AmbientCrackersAnimation, FireworkTrails };
export default CrackersAnimation;
