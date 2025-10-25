import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import type { User } from '../App';

interface ProfileScreenProps {
  user: User;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
}

export default function ProfileScreen({ user, onBack, onUpdateUser }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(user.nickname);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);

  const avatars = ['🪖', '🎖️', '⚔️', '🛡️', '💣', '🚁', '🎯', '👑', '🔥', '⭐'];

  const handleSave = () => {
    if (newNickname.trim().length < 3) {
      toast.error('Никнейм должен быть минимум 3 символа');
      return;
    }

    const updatedUser = {
      ...user,
      nickname: newNickname,
      avatar: selectedAvatar
    };
    onUpdateUser(updatedUser);
    setIsEditing(false);
    toast.success('Профиль обновлен!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Button onClick={onBack} variant="outline" className="mb-6 border-orange-500/50">
          <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Назад в меню
        </Button>

        <Card className="p-8 bg-slate-900/90 backdrop-blur-xl border-orange-500/30">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{user.avatar}</div>
            <h2 className="text-3xl font-bold text-white orbitron mb-2">{user.nickname}</h2>
            <p className="text-gray-400 text-sm">{user.id}</p>
            <p className="text-orange-500 font-semibold mt-2">{user.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Баланс</div>
              <div className="text-2xl font-bold text-green-400">💰 {user.balance}</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Донат баланс</div>
              <div className="text-2xl font-bold text-purple-400">💎 {user.donatBalance}</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Статус</div>
              <div className="text-lg font-semibold text-white">{user.status}</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Пройдено уровней</div>
              <div className="text-lg font-semibold text-orange-400">{user.completedLevels.length} / 10</div>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Никнейм</label>
                <Input
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Аватар</label>
                <div className="grid grid-cols-5 gap-2">
                  {avatars.map(avatar => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`text-3xl p-3 rounded-lg transition-all ${
                        selectedAvatar === avatar 
                          ? 'bg-orange-500 scale-110' 
                          : 'bg-slate-800/50 hover:bg-slate-700/50'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
                  Сохранить
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="w-full bg-orange-600 hover:bg-orange-700">
              <Icon name="Edit" className="w-4 h-4 mr-2" />
              Редактировать профиль
            </Button>
          )}

          {user.hasVeteranTitle && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg">
              <div className="text-center">
                <div className="text-3xl mb-2">🎖️</div>
                <div className="text-yellow-400 font-bold">Ветеран войны</div>
                <div className="text-gray-400 text-sm mt-1">Все дополнительные миссии пройдены</div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
