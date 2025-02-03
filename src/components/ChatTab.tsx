import { useSession } from '@supabase/auth-helpers-react';
import { MessageList } from './chat/MessageList';
import { MessageInput } from './chat/MessageInput';
import { useChat } from './chat/useChat';

const ChatTab = () => {
  const session = useSession();
  const { messages, isLoading, sendMessage } = useChat(session?.user?.id);

  const handleSubmit = async (e: React.FormEvent, newMessage: string) => {
    e.preventDefault();
    if (newMessage.trim()) {
      await sendMessage(newMessage);
    }
  };

  return (
    <div className="flex flex-col h-[500px] p-4">
      <MessageList 
        messages={messages} 
        currentUserId={session?.user?.id || ''} 
      />
      <MessageInput
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatTab;