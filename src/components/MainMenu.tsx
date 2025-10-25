import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import type { User, Screen } from '../App';

interface MainMenuProps {
  user: User;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  onSelectLevel: (level: number) => void;
}

export default function MainMenu({ user, onNavigate, onLogout, onSelectLevel }: MainMenuProps) {
  const menuItems = [
    { icon: 'User', label: 'Профиль', screen: 'profile' as Screen, color: 'from-blue-600 to-cyan-600' },
    { icon: 'Crosshair', label: 'Уровни', screen: 'levels' as Screen, color: 'from-orange-600 to-red-600' },
    { icon: 'Users', label: 'Мультиплеер', screen: 'multiplayer' as Screen, color: 'from-purple-600 to-pink-600' },
    { icon: 'UserPlus', label: 'Друзья', screen: 'friends' as Screen, color: 'from-green-600 to-emerald-600' },
    { icon: 'ShoppingCart', label: 'Магазин', screen: 'shop' as Screen, color: 'from-yellow-600 to-orange-600' },
    { icon: 'MessageSquare', label: 'Чат', screen: 'chat' as Screen, color: 'from-indigo-600 to-blue-600' },
  ];

  if (user.isAdmin) {
    menuItems.push({ 
      icon: 'Shield', 
      label: 'Админ-панель', 
      screen: 'admin' as Screen, 
      color: 'from-red-600 to-rose-600' 
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900" />
      
      <div className="w-full max-w-6xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 orbitron">
            WARZONA
          </h1>
          <div className="flex items-center justify-center gap-3 text-gray-300">
            <span className="text-lg">{user.avatar}</span>
            <span className="text-xl font-semibold">{user.nickname}</span>
            <span className="text-sm bg-slate-800/50 px-3 py-1 rounded-full">{user.id}</span>
          </div>
          <p className="text-gray-400 mt-2">{user.title}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
          {menuItems.map((item, index) => (
            <Card
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={`p-8 bg-slate-900/70 backdrop-blur-xl border-slate-700 hover:border-orange-500/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 group animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon name={item.icon as any} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 orbitron">{item.label}</h3>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <Icon name="LogOut" className="w-4 h-4 mr-2" />
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
}