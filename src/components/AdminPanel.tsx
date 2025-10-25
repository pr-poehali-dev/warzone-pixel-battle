import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import type { User } from '../App';

interface AdminPanelProps {
  user: User;
  onBack: () => void;
}

export default function AdminPanel({ user, onBack }: AdminPanelProps) {
  const [targetNick, setTargetNick] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [adminTargetNick, setAdminTargetNick] = useState('');

  const handleGiveBalance = () => {
    if (!targetNick || !balanceAmount) {
      toast.error('Заполните все поля');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const targetUser = users.find(u => u.nickname === targetNick || u.id === targetNick);

    if (!targetUser) {
      toast.error('Пользователь не найден');
      return;
    }

    targetUser.balance += parseInt(balanceAmount);
    localStorage.setItem('users', JSON.stringify(users));
    
    toast.success(`Выдано ${balanceAmount} монет игроку ${targetUser.nickname}`);
    setTargetNick('');
    setBalanceAmount('');
  };

  const handleGiveAdmin = () => {
    if (!adminTargetNick) {
      toast.error('Введите никнейм или ID');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const targetUser = users.find(u => u.nickname === adminTargetNick || u.id === adminTargetNick);

    if (!targetUser) {
      toast.error('Пользователь не найден');
      return;
    }

    if (targetUser.isAdmin) {
      toast.warning('Этот пользователь уже админ');
      return;
    }

    targetUser.isAdmin = true;
    targetUser.id = 'Dev-Team';
    targetUser.title = '🎖️ Администратор';
    localStorage.setItem('users', JSON.stringify(users));
    
    toast.success(`Админ права выданы игроку ${targetUser.nickname}`);
    setAdminTargetNick('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Button onClick={onBack} variant="outline" className="mb-6 border-orange-500/50">
          <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <Card className="p-8 bg-slate-900/90 backdrop-blur-xl border-red-500/30">
          <div className="text-center mb-8">
            <Icon name="Shield" className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-3xl font-bold text-white orbitron">АДМИН-ПАНЕЛЬ</h2>
            <p className="text-gray-400 text-sm mt-2">ID: {user.id}</p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/30 p-6 rounded-lg">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Icon name="DollarSign" className="w-5 h-5 text-green-400" />
                Выдать баланс
              </h3>
              <div className="space-y-3">
                <Input
                  placeholder="Никнейм или ID игрока"
                  value={targetNick}
                  onChange={(e) => setTargetNick(e.target.value)}
                  className="bg-slate-800/50 border-slate-700"
                />
                <Input
                  type="number"
                  placeholder="Сумма"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  className="bg-slate-800/50 border-slate-700"
                />
                <Button
                  onClick={handleGiveBalance}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Выдать
                </Button>
              </div>
            </div>

            <div className="bg-slate-800/30 p-6 rounded-lg">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Icon name="Crown" className="w-5 h-5 text-yellow-400" />
                Выдать админку
              </h3>
              <div className="space-y-3">
                <Input
                  placeholder="Никнейм или ID игрока"
                  value={adminTargetNick}
                  onChange={(e) => setAdminTargetNick(e.target.value)}
                  className="bg-slate-800/50 border-slate-700"
                />
                <Button
                  onClick={handleGiveAdmin}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Выдать админ права
                </Button>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <p className="text-red-400 text-sm">
                ⚠️ Используйте админ-панель ответственно. Все действия логируются.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
