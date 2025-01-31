import { useState } from 'react';
import PostList from './PostList';
import ThemeFilter from './ThemeFilter';
import { ScrollArea } from "@/components/ui/scroll-area";

const PostListContainer = () => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <ThemeFilter
        selectedTheme={selectedTheme}
        onThemeSelect={setSelectedTheme}
      />
      
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-4 p-4">
          <PostList selectedTheme={selectedTheme} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default PostListContainer;