import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import type { User } from '../App';

interface ShopScreenProps {
  user: User;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
}

interface ShopItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  type: 'weapon' | 'vehicle' | 'special';
}

export default function ShopScreen({ user, onBack, onUpdateUser }: ShopScreenProps) {
  const shopItems: ShopItem[] = [
    { id: 'ak47', name: 'AK-47', price: 500, icon: '🔫', type: 'weapon' },
    { id: 'm4a1', name: 'M4A1', price: 750, icon: '🔫', type: 'weapon' },
    { id: 'awp', name: 'AWP Снайперка', price: 1200, icon: '🎯', type: 'weapon' },
    { id: 'deagle', name: 'Desert Eagle', price: 600, icon: '🔫', type: 'weapon' },
    { id: 'grenade', name: 'Граната', price: 200, icon: '💣', type: 'weapon' },
    { id: 'tank', name: 'Танк T-90', price: 5000, icon: '🚜', type: 'vehicle' },
    { id: 'helicopter', name: 'Вертолет', price: 7000, icon: '🚁', type: 'vehicle' },
    { id: 'missile', name: 'Ракетная установка', price: 3000, icon: '🚀', type: 'special' },
    { id: 'airstrike', name: 'Авиа-удар', price: 4000, icon: '✈️', type: 'special' },
  ];

  const handlePurchase = (item: ShopItem) => {
    if (user.weapons.includes(item.name)) {
      toast.error('У вас уже есть это оружие!');
      return;
    }

    if (user.balance < item.price) {
      toast.error('Недостаточно средств!');
      return;
    }

    const updatedUser = {
      ...user,
      balance: user.balance - item.price,
      weapons: [...user.weapons, item.name]
    };

    onUpdateUser(updatedUser);
    toast.success(`${item.name} куплен! Проверьте арсенал`);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="border-orange-500/50">
            <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <div className="flex gap-4">
            <div className="bg-slate-800/50 px-4 py-2 rounded-lg text-green-400 font-bold">
              💰 {user.balance}
            </div>
            <div className="bg-slate-800/50 px-4 py-2 rounded-lg text-purple-400 font-bold">
              💎 {user.donatBalance}
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-8 orbitron text-center">
          🛒 ВОЕННЫЙ МАГАЗИН
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopItems.map(item => {
            const owned = user.weapons.includes(item.name);
            return (
              <Card
                key={item.id}
                className={`p-6 bg-slate-900/90 backdrop-blur-xl border-orange-500/30 transition-all hover:scale-105 ${
                  owned ? 'opacity-50' : ''
                }`}
              >
                <div className="text-5xl text-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white text-center mb-2">{item.name}</h3>
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-green-400">💰 {item.price}</span>
                </div>
                <Button
                  onClick={() => handlePurchase(item)}
                  disabled={owned}
                  className={`w-full ${
                    owned
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                  }`}
                >
                  {owned ? '✅ Куплено' : 'Купить'}
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-slate-800/50 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4 orbitron">📦 МОЙ АРСЕНАЛ</h3>
          <div className="flex flex-wrap gap-2">
            {user.weapons.length > 0 ? (
              user.weapons.map((weapon, index) => (
                <div
                  key={index}
                  className="bg-orange-500/20 border border-orange-500/50 px-4 py-2 rounded-lg text-white"
                >
                  {weapon}
                </div>
              ))
            ) : (
              <p className="text-gray-400">Арсенал пуст. Купите первое оружие!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
