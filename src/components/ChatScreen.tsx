import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import type { User } from '../App';

interface ChatScreenProps {
  user: User;
  onBack: () => void;
}

interface Message {
  id: number;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export default function ChatScreen({ user, onBack }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      const initialMessages: Message[] = [
        {
          id: 1,
          user: 'Система',
          avatar: '🤖',
          text: 'Добро пожаловать в общий чат WarZone!',
          timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(initialMessages);
    }
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now(),
      user: user.nickname,
      avatar: user.avatar,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <Button onClick={onBack} variant="outline" className="mb-6 border-orange-500/50">
          <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <Card className="p-6 bg-slate-900/90 backdrop-blur-xl border-orange-500/30">
          <h2 className="text-2xl font-bold text-white text-center mb-6 orbitron">
            💬 ОБЩИЙ ЧАТ
          </h2>

          <div className="bg-slate-800/50 rounded-lg p-4 h-96 overflow-y-auto mb-4 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.user === user.nickname ? 'flex-row-reverse' : ''}`}
              >
                <div className="text-2xl flex-shrink-0">{msg.avatar}</div>
                <div className={`flex-1 ${msg.user === user.nickname ? 'text-right' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-orange-400">{msg.user}</span>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      msg.user === user.nickname
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-700 text-gray-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Написать сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="bg-slate-800/50 border-slate-700"
            />
            <Button onClick={handleSendMessage} className="bg-orange-600 hover:bg-orange-700">
              <Icon name="Send" className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
