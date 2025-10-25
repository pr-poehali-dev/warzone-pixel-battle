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
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickAngle, setJoystickAngle] = useState(0);
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
    if (!joystickActive) return;

    const interval = setInterval(() => {
      const speed = 3;
      const newX = playerX + Math.cos(joystickAngle) * speed;
      const newY = playerY + Math.sin(joystickAngle) * speed;

      if (newX >= 0 && newX <= 400) setPlayerX(newX);
      if (newY >= 50 && newY <= 500) setPlayerY(newY);
    }, 16);

    return () => clearInterval(interval);
  }, [joystickActive, joystickAngle, playerX, playerY]);

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

  const handleJoystickStart = (e: React.TouchEvent | React.MouseEvent) => {
    setJoystickActive(true);
  };

  const handleJoystickMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!joystickActive) return;

    const touch = 'touches' in e ? e.touches[0] : e;
    const joystickElement = (e.target as HTMLElement).getBoundingClientRect();
    const centerX = joystickElement.left + joystickElement.width / 2;
    const centerY = joystickElement.top + joystickElement.height / 2;

    const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
    setJoystickAngle(angle);
  };

  const handleJoystickEnd = () => {
    setJoystickActive(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={onBack} variant="outline" className="border-orange-500/50">
            <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <div className="text-white text-xl font-bold orbitron">
            Уровень {level} | Врагов: {enemies.length}
          </div>
          <div className="text-orange-500 font-bold">
            {canShoot ? '🎯 Готов' : '⏳ Перезарядка'}
          </div>
        </div>

        <div
          ref={canvasRef}
          onClick={(e) => handleShoot(e.clientX, e.clientY)}
          className="relative w-full h-[600px] bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-orange-500/30 rounded-lg overflow-hidden cursor-crosshair"
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

          <div className="absolute top-4 left-4 text-white text-sm space-y-1">
            <div>🎯 Убито: {enemiesKilled}</div>
            <div>💰 Награда: {enemiesKilled * 100} монет</div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <div
            onMouseDown={handleJoystickStart}
            onMouseMove={handleJoystickMove}
            onMouseUp={handleJoystickEnd}
            onMouseLeave={handleJoystickEnd}
            onTouchStart={handleJoystickStart}
            onTouchMove={handleJoystickMove}
            onTouchEnd={handleJoystickEnd}
            className="w-32 h-32 bg-slate-800/50 rounded-full border-2 border-orange-500/30 flex items-center justify-center cursor-move select-none"
          >
            <div className={`w-12 h-12 bg-orange-500 rounded-full transition-transform ${joystickActive ? 'scale-90' : ''}`}>
              <Icon name="Move" className="w-8 h-8 text-white m-auto mt-2" />
            </div>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm mt-4">
          Кликай по полю боя для стрельбы • Двойной клик = Авиа-бомба 💣 • Используй джойстик для передвижения
        </div>
      </div>
    </div>
  );
}