import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import type { User } from '../App';

interface GameScreenProps {
  user: User;
  level: number;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  health: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

export default function GameScreen({ user, level, onBack, onUpdateUser }: GameScreenProps) {
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(400);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [canShoot, setCanShoot] = useState(true);
  const [enemiesKilled, setEnemiesKilled] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastClickTime = useRef(0);
  const shootSoundRef = useRef<HTMLAudioElement | null>(null);
  const explosionSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    shootSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
    explosionSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2803/2803-preview.mp3');
    shootSoundRef.current.volume = 0.3;
    explosionSoundRef.current.volume = 0.4;
  }, []);

  useEffect(() => {
    const initialEnemies: Enemy[] = [];
    const enemyCount = 5 + level * 2;
    
    for (let i = 0; i < enemyCount; i++) {
      initialEnemies.push({
        id: i,
        x: 600 + Math.random() * 150,
        y: 100 + Math.random() * 400,
        health: 100
      });
    }
    setEnemies(initialEnemies);
  }, [level]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 20;
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setPlayerY(prev => Math.max(50, prev - step));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setPlayerY(prev => Math.min(500, prev + step));
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setPlayerX(prev => Math.max(0, prev - step));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setPlayerX(prev => Math.min(400, prev + step));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBullets(prev => {
        return prev.map(bullet => {
          const dx = bullet.targetX - bullet.x;
          const dy = bullet.targetY - bullet.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 10) return null;
          
          const speed = 8;
          const angle = Math.atan2(dy, dx);
          
          return {
            ...bullet,
            x: bullet.x + Math.cos(angle) * speed,
            y: bullet.y + Math.sin(angle) * speed
          };
        }).filter(Boolean) as Bullet[];
      });

      setEnemies(prev => {
        let newEnemies = [...prev];
        bullets.forEach(bullet => {
          newEnemies = newEnemies.map(enemy => {
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 15) {
              const newHealth = enemy.health - 50;
              if (newHealth <= 0) {
                setEnemiesKilled(k => k + 1);
                if (explosionSoundRef.current) {
                  explosionSoundRef.current.currentTime = 0;
                  explosionSoundRef.current.play().catch(() => {});
                }
                return null;
              }
              return { ...enemy, health: newHealth };
            }
            return enemy;
          }).filter(Boolean) as Enemy[];
        });
        return newEnemies;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [bullets]);

  useEffect(() => {
    if (enemies.length === 0 && enemiesKilled > 0) {
      toast.success(`Уровень ${level} пройден! +500 монет`);
      const updatedUser = {
        ...user,
        balance: user.balance + 500,
        completedLevels: [...user.completedLevels, level]
      };
      onUpdateUser(updatedUser);
      setTimeout(onBack, 2000);
    }
  }, [enemies, enemiesKilled]);

  const handleShoot = (clientX: number, clientY: number) => {
    if (!canShoot) return;

    const now = Date.now();
    const isDoubleClick = now - lastClickTime.current < 300;
    lastClickTime.current = now;

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const targetX = clientX - rect.left;
      const targetY = clientY - rect.top;

      const newBullet: Bullet = {
        id: Date.now(),
        x: playerX,
        y: playerY,
        targetX,
        targetY
      };

      setBullets(prev => [...prev, newBullet]);
      
      if (shootSoundRef.current) {
        shootSoundRef.current.currentTime = 0;
        shootSoundRef.current.play().catch(() => {});
      }
      
      if (isDoubleClick) {
        toast.success('Авиа-бомба запущена! 💣');
        if (explosionSoundRef.current) {
          explosionSoundRef.current.currentTime = 0;
          explosionSoundRef.current.play().catch(() => {});
        }
      }

      setCanShoot(false);
      setTimeout(() => setCanShoot(true), 600);
    }
  };



  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-950">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-2 sm:mb-4 gap-2">
          <Button onClick={onBack} variant="outline" className="border-orange-500/50 text-xs sm:text-base px-2 sm:px-4">
            <Icon name="ArrowLeft" className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Назад</span>
          </Button>
          <div className="text-white text-xs sm:text-xl font-bold orbitron text-center">
            Ур. {level} | {enemies.length}
          </div>
          <div className="text-orange-500 font-bold text-xs sm:text-base">
            {canShoot ? '🎯' : '⏳'}
          </div>
        </div>

        <div
          ref={canvasRef}
          onClick={(e) => handleShoot(e.clientX, e.clientY)}
          className="relative w-full h-[300px] sm:h-[600px] bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-orange-500/30 rounded-lg overflow-hidden cursor-crosshair"
          style={{ touchAction: 'none' }}
        >
          <div 
            className="absolute w-3 h-3 bg-blue-500 rounded-full transition-all duration-75 shadow-lg shadow-blue-500/50"
            style={{ left: playerX, top: playerY, transform: 'translate(-50%, -50%)' }}
          />

          {enemies.map(enemy => (
            <div
              key={enemy.id}
              className="absolute w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"
              style={{ left: enemy.x, top: enemy.y, transform: 'translate(-50%, -50%)' }}
            />
          ))}

          {bullets.map(bullet => (
            <div
              key={bullet.id}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
              style={{ left: bullet.x, top: bullet.y }}
            />
          ))}

          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-white text-xs sm:text-sm space-y-1">
            <div>🎯 {enemiesKilled}</div>
            <div>💰 {enemiesKilled * 100}</div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 sm:gap-3 mt-2 sm:mt-4">
          <Button
            onMouseDown={() => setPlayerY(Math.max(50, playerY - 20))}
            onTouchStart={() => setPlayerY(Math.max(50, playerY - 20))}
            className="bg-slate-800 hover:bg-slate-700 text-white w-12 h-12 sm:w-16 sm:h-16 p-0"
          >
            <Icon name="ArrowUp" className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </div>
        <div className="flex justify-center items-center gap-2 sm:gap-3 mt-2">
          <Button
            onMouseDown={() => setPlayerX(Math.max(0, playerX - 20))}
            onTouchStart={() => setPlayerX(Math.max(0, playerX - 20))}
            className="bg-slate-800 hover:bg-slate-700 text-white w-12 h-12 sm:w-16 sm:h-16 p-0"
          >
            <Icon name="ArrowLeft" className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <Button
            onMouseDown={() => setPlayerY(Math.min(500, playerY + 20))}
            onTouchStart={() => setPlayerY(Math.min(500, playerY + 20))}
            className="bg-slate-800 hover:bg-slate-700 text-white w-12 h-12 sm:w-16 sm:h-16 p-0"
          >
            <Icon name="ArrowDown" className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <Button
            onMouseDown={() => setPlayerX(Math.min(400, playerX + 20))}
            onTouchStart={() => setPlayerX(Math.min(400, playerX + 20))}
            className="bg-slate-800 hover:bg-slate-700 text-white w-12 h-12 sm:w-16 sm:h-16 p-0"
          >
            <Icon name="ArrowRight" className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </div>

        <div className="text-center text-gray-400 text-xs sm:text-sm mt-2 sm:mt-4 px-2">
          Кликай для стрельбы • 2х клик = Бомба 💣 • Кнопки/WASD для движения
        </div>
      </div>
    </div>
  );
}