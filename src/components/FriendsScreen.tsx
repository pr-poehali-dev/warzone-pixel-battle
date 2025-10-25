import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import type { User } from '../App';

interface FriendsScreenProps {
  user: User;
  onBack: () => void;
}

interface Friend {
  id: string;
  nickname: string;
  avatar: string;
  online: boolean;
}

export default function FriendsScreen({ user, onBack }: FriendsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', nickname: 'Soldier_117', avatar: '🪖', online: true },
    { id: '2', nickname: 'WarMachine', avatar: '🎖️', online: false },
  ]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Введите никнейм для поиска');
      return;
    }
    toast.info(`Поиск игрока ${searchQuery}...`);
  };

  const handleAddFriend = (nickname: string) => {
    toast.success(`Запрос в друзья отправлен игроку ${nickname}`);
  };

  const handleInviteToMatch = (friend: Friend) => {
    if (!friend.online) {
      toast.error('Игрок оффлайн');
      return;
    }
    toast.success(`Приглашение в матч отправлено игроку ${friend.nickname}`);
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
            👥 ДРУЗЬЯ
          </h2>

          <div className="mb-6">
            <label className="text-sm text-gray-300 mb-2 block">Поиск игроков</label>
            <div className="flex gap-2">
              <Input
                placeholder="Введите никнейм..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800/50 border-slate-700"
              />
              <Button onClick={handleSearch} className="bg-orange-600 hover:bg-orange-700">
                <Icon name="Search" className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Список друзей ({friends.length})</h3>
            
            {friends.map(friend => (
              <div
                key={friend.id}
                className="bg-slate-800/50 p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{friend.avatar}</div>
                  <div>
                    <div className="text-white font-semibold">{friend.nickname}</div>
                    <div className={`text-sm ${friend.online ? 'text-green-400' : 'text-gray-400'}`}>
                      {friend.online ? '🟢 Онлайн' : '⚫ Оффлайн'}
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleInviteToMatch(friend)}
                  disabled={!friend.online}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Icon name="Gamepad2" className="w-4 h-4 mr-2" />
                  Пригласить в матч
                </Button>
              </div>
            ))}

            {friends.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                У вас пока нет друзей. Используйте поиск, чтобы найти игроков!
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
