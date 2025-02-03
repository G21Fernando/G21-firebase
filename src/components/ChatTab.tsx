import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { MessageList } from './chat/MessageList';
import { MessageInput } from './chat/MessageInput';
import { useChat } from './chat/useChat';

const ChatTab = () => {
  console.log('🎸 ChatTab component loaded at:', new Date().toISOString());
  const [newMessage, setNewMessage] = useState('');
  const session = useSession();
  const { messages, isLoading, sendMessage } = useChat(session?.user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      await sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[500px] p-4">
      <MessageList 
        messages={messages} 
        currentUserId={session?.user?.id || ''} 
      />
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatTab;