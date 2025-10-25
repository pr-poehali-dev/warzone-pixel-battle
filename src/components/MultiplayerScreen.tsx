import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import type { User } from '../App';

interface MultiplayerScreenProps {
  user: User;
  onBack: () => void;
}

export default function MultiplayerScreen({ user, onBack }: MultiplayerScreenProps) {
  const [searchNick, setSearchNick] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearchOpponent = () => {
    if (!searchNick.trim()) {
      toast.error('Введите никнейм противника');
      return;
    }
    toast.info(`Поиск игрока ${searchNick}...`);
    setSearching(true);
    setTimeout(() => {
      toast.error('Игрок не найден в сети');
      setSearching(false);
    }, 2000);
  };

  const handleFindMatch = () => {
    toast.info('Поиск матча 2x2...');
    setSearching(true);
    setTimeout(() => {
      toast.warning('Нет доступных игроков онлайн');
      setSearching(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Button onClick={onBack} variant="outline" className="mb-6 border-orange-500/50">
          <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <Card className="p-8 bg-slate-900/90 backdrop-blur-xl border-orange-500/30">
          <h2 className="text-3xl font-bold text-white text-center mb-8 orbitron">
            🎮 МУЛЬТИПЛЕЕР
          </h2>

          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Поиск противника по нику</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Введите никнейм..."
                  value={searchNick}
                  onChange={(e) => setSearchNick(e.target.value)}
                  className="bg-slate-800/50 border-slate-700"
                />
                <Button
                  onClick={handleSearchOpponent}
                  disabled={searching}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Icon name="Search" className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-gray-400">или</span>
              </div>
            </div>

            <Button
              onClick={handleFindMatch}
              disabled={searching}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
            >
              {searching ? (
                <>
                  <Icon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                  Поиск матча...
                </>
              ) : (
                <>
                  <Icon name="Users" className="w-5 h-5 mr-2" />
                  Найти матч 2x2
                </>
              )}
            </Button>

            <div className="bg-slate-800/30 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">📊 Статистика</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Побед</div>
                  <div className="text-green-400 font-bold">0</div>
                </div>
                <div>
                  <div className="text-gray-400">Поражений</div>
                  <div className="text-red-400 font-bold">0</div>
                </div>
                <div>
                  <div className="text-gray-400">K/D</div>
                  <div className="text-yellow-400 font-bold">0.0</div>
                </div>
                <div>
                  <div className="text-gray-400">Рейтинг</div>
                  <div className="text-purple-400 font-bold">1000</div>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-400 text-sm">
              💡 Мультиплеер появится в следующем обновлении
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
