import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import type { User } from '../App';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [loginNick, setLoginNick] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regNick, setRegNick] = useState('');
  const [regPass, setRegPass] = useState('');

  const handleLogin = () => {
    if (!loginNick || !loginPass) {
      toast.error('Заполните все поля');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (loginNick === 'plutka' && loginPass === 'user') {
      const adminUser: User = {
        id: 'Dev-Team',
        nickname: 'plutka',
        email: 'admin@warzone.com',
        password: 'user',
        balance: 999999,
        donatBalance: 999999,
        title: '🎖️ Главнокомандующий',
        status: 'Admin',
        avatar: '👑',
        isAdmin: true,
        completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        hasVeteranTitle: true,
        weapons: ['AK-47', 'M4A1', 'AWP', 'Desert Eagle']
      };
      onLogin(adminUser);
      toast.success('Добро пожаловать, Командир!');
      return;
    }

    const user = users.find(u => u.nickname === loginNick && u.password === loginPass);
    
    if (user) {
      onLogin(user);
      toast.success(`Добро пожаловать, ${user.nickname}!`);
    } else {
      toast.error('Неверный логин или пароль');
    }
  };

  const handleRegister = () => {
    if (!regEmail || !regNick || !regPass) {
      toast.error('Заполните все поля');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.nickname === regNick)) {
      toast.error('Никнейм уже занят');
      return;
    }

    const newUser: User = {
      id: `USER-${Date.now()}`,
      nickname: regNick,
      email: regEmail,
      password: regPass,
      balance: 1000,
      donatBalance: 0,
      title: '🎖️ Новобранец',
      status: 'Солдат',
      avatar: '🪖',
      isAdmin: false,
      completedLevels: [],
      hasVeteranTitle: false,
      weapons: ['Пистолет']
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    onLogin(newUser);
    toast.success('Регистрация успешна! Добро пожаловать в WarZona!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-military-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-transparent to-red-900/20" />
      
      <Card className="w-full max-w-md p-4 sm:p-8 bg-slate-900/90 backdrop-blur-xl border-orange-500/30 shadow-2xl relative z-10 animate-scale-in">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 orbitron">
            WARZONA
          </h1>
          <p className="text-sm sm:text-base text-gray-400">Военный онлайн-шутер</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Никнейм</label>
              <Input
                type="text"
                placeholder="Введите никнейм"
                value={loginNick}
                onChange={(e) => setLoginNick(e.target.value)}
                className="bg-slate-800/50 border-slate-700"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Пароль</label>
              <Input
                type="password"
                placeholder="Введите пароль"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="bg-slate-800/50 border-slate-700"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button 
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold"
            >
              Войти в игру
            </Button>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Никнейм</label>
              <Input
                type="text"
                placeholder="Ваш игровой ник"
                value={regNick}
                onChange={(e) => setRegNick(e.target.value)}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Пароль</label>
              <Input
                type="password"
                placeholder="Создайте пароль"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
            <Button 
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold"
            >
              Зарегистрироваться
            </Button>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}