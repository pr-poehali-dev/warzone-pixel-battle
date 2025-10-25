import { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import AuthScreen from './components/AuthScreen';
import GameScreen from './components/GameScreen';
import ProfileScreen from './components/ProfileScreen';
import ShopScreen from './components/ShopScreen';
import MultiplayerScreen from './components/MultiplayerScreen';
import FriendsScreen from './components/FriendsScreen';
import ChatScreen from './components/ChatScreen';
import AdminPanel from './components/AdminPanel';
import LevelSelect from './components/LevelSelect';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

export interface User {
  id: string;
  nickname: string;
  email: string;
  password: string;
  balance: number;
  donatBalance: number;
  title: string;
  status: string;
  avatar: string;
  isAdmin: boolean;
  completedLevels: number[];
  hasVeteranTitle: boolean;
  weapons: string[];
}

export type Screen = 'auth' | 'menu' | 'game' | 'levels' | 'profile' | 'shop' | 'multiplayer' | 'friends' | 'chat' | 'admin';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setCurrentScreen('menu');
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentScreen('menu');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentScreen('auth');
  };

  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {currentScreen === 'auth' && <AuthScreen onLogin={handleLogin} />}
      {currentScreen === 'menu' && currentUser && (
        <MainMenu 
          user={currentUser} 
          onNavigate={setCurrentScreen}
          onLogout={handleLogout}
          onSelectLevel={(level) => {
            setSelectedLevel(level);
            setCurrentScreen('game');
          }}
        />
      )}
      {currentScreen === 'levels' && currentUser && (
        <LevelSelect
          user={currentUser}
          onBack={() => setCurrentScreen('menu')}
          onSelectLevel={(level) => {
            setSelectedLevel(level);
            setCurrentScreen('game');
          }}
        />
      )}
      {currentScreen === 'game' && currentUser && (
        <GameScreen 
          user={currentUser}
          level={selectedLevel}
          onBack={() => setCurrentScreen('levels')}
          onUpdateUser={updateUser}
        />
      )}
      {currentScreen === 'profile' && currentUser && (
        <ProfileScreen 
          user={currentUser}
          onBack={() => setCurrentScreen('menu')}
          onUpdateUser={updateUser}
        />
      )}
      {currentScreen === 'shop' && currentUser && (
        <ShopScreen 
          user={currentUser}
          onBack={() => setCurrentScreen('menu')}
          onUpdateUser={updateUser}
        />
      )}
      {currentScreen === 'multiplayer' && currentUser && (
        <MultiplayerScreen 
          user={currentUser}
          onBack={() => setCurrentScreen('menu')}
        />
      )}
      {currentScreen === 'friends' && currentUser && (
        <FriendsScreen 
          user={currentUser}
          onBack={() => setCurrentScreen('menu')}
        />
      )}
      {currentScreen === 'chat' && currentUser && (
        <ChatScreen 
          user={currentUser}
          onBack={() => setCurrentScreen('menu')}
        />
      )}
      {currentScreen === 'admin' && currentUser && currentUser.isAdmin && (
        <AdminPanel 
          user={currentUser}
          onBack={() => setCurrentScreen('menu')}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;