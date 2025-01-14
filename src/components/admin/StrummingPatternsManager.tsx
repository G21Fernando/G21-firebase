import { useState } from 'react';
import { Folder, Music, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StrummingPatternsManager = () => {
  const [isAddingPattern, setIsAddingPattern] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Strumming 21
        </CardTitle>
        <Button onClick={() => setIsAddingPattern(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Pattern
        </Button>
      </CardHeader>
      <CardContent>
        {/* Strumming patterns list and management UI will be implemented here */}
        <div className="text-sm text-muted-foreground">
          Strumming patterns management interface coming soon...
        </div>
      </CardContent>
    </Card>
  );
};

export default StrummingPatternsManager;