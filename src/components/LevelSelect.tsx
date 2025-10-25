import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import type { User } from '../App';

interface LevelSelectProps {
  user: User;
  onBack: () => void;
  onSelectLevel: (level: number) => void;
}

export default function LevelSelect({ user, onBack, onSelectLevel }: LevelSelectProps) {
  const levels = [
    { num: 1, name: 'Полигон', unlocked: true },
    { num: 2, name: 'Граница', unlocked: true },
    { num: 3, name: 'База', unlocked: true },
    { num: 4, name: 'Завод', unlocked: true },
    { num: 5, name: 'Мост', unlocked: true },
    { num: 6, name: 'Город', unlocked: true },
    { num: 7, name: 'Аэропорт', unlocked: true },
    { num: 8, name: 'Бункер', unlocked: true },
    { num: 9, name: 'Штаб', unlocked: true },
    { num: 10, name: 'Финал Ч.1', unlocked: true },
    { num: 10.2, name: 'Финал Ч.2', unlocked: user.completedLevels.includes(10) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-5xl">
        <Button onClick={onBack} variant="outline" className="mb-4 sm:mb-6 border-orange-500/50 text-xs sm:text-base">
          <Icon name="ArrowLeft" className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Назад в меню
        </Button>

        <h1 className="text-2xl sm:text-4xl font-bold text-white text-center mb-4 sm:mb-8 orbitron">
          ВЫБОР УРОВНЯ
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {levels.map((level) => {
            const isCompleted = user.completedLevels.includes(level.num);
            const isLocked = !level.unlocked;

            return (
              <Card
                key={level.num}
                onClick={() => !isLocked && onSelectLevel(level.num)}
                className={`p-3 sm:p-6 bg-slate-900/90 backdrop-blur-xl border-orange-500/30 transition-all ${
                  isLocked
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:scale-105 cursor-pointer hover:border-orange-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-bold text-orange-500 mb-1 sm:mb-2 orbitron">
                    {level.num === 10.2 ? '10.2' : level.num}
                  </div>
                  <div className="text-white text-xs sm:text-base font-semibold mb-1 sm:mb-2">{level.name}</div>
                  {isCompleted && (
                    <div className="text-green-400 text-xs sm:text-sm">✅</div>
                  )}
                  {isLocked && (
                    <div className="text-red-400 text-xs sm:text-sm">🔒</div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {user.completedLevels.length === 11 && (
          <div className="mt-4 sm:mt-8 p-3 sm:p-6 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg text-center">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">🎖️</div>
            <div className="text-yellow-400 font-bold text-base sm:text-xl">Все уровни пройдены!</div>
            <div className="text-gray-400 text-xs sm:text-base mt-1 sm:mt-2">Скоро появятся дополнительные миссии</div>
          </div>
        )}
      </div>
    </div>
  );
}