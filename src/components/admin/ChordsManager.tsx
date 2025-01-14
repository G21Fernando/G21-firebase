import { useState } from 'react';
import { Folder, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ChordsManager = () => {
  const [isAddingChord, setIsAddingChord] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Chords Management
        </CardTitle>
        <Button onClick={() => setIsAddingChord(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Chord
        </Button>
      </CardHeader>
      <CardContent>
        {/* Chord list and management UI will be implemented here */}
        <div className="text-sm text-muted-foreground">
          Chord management interface coming soon...
        </div>
      </CardContent>
    </Card>
  );
};

export default ChordsManager;