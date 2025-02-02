import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  username: string;
  is_ai?: boolean;
  user_id: string;
}

export const MessageList = ({ messages, currentUserId }: { messages: Message[], currentUserId: string }) => {
  return (
    <ScrollArea className="flex-1 pr-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.user_id === currentUserId
                ? 'bg-primary text-primary-foreground ml-auto'
                : message.is_ai
                ? 'bg-secondary'
                : 'bg-muted'
            } max-w-[80%] break-words ${
              message.user_id === currentUserId ? 'ml-auto' : ''
            }`}
          >
            <div className="font-semibold text-sm">
              {message.username}
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};