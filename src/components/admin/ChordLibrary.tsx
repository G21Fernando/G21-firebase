import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const ChordLibrary = () => {
  const { toast } = useToast();
  const [isAddingChord, setIsAddingChord] = useState(false);

  const { data: chords, isLoading } = useQuery({
    queryKey: ["chord-diagrams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chord_positions")
        .select("chord_name")
        .order("chord_name");

      if (error) {
        toast({
          title: "Error fetching chords",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Get unique chord names
      const uniqueChords = [...new Set(data.map(c => c.chord_name))];
      return uniqueChords;
    },
  });

  const handleAddChord = () => {
    setIsAddingChord(true);
    // TODO: Implement chord addition modal
    toast({
      title: "Coming soon",
      description: "Chord addition feature is under development",
    });
    setIsAddingChord(false);
  };

  if (isLoading) {
    return <div>Loading chord library...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Available Chords</h3>
          <p className="text-muted-foreground">
            Manage the chord diagrams available in G21
          </p>
        </div>
        <Button onClick={handleAddChord} disabled={isAddingChord}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Chord
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chords?.map((chord) => (
          <Card key={chord}>
            <CardHeader>
              <CardTitle>{chord}</CardTitle>
              <CardDescription>Chord Diagram</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                Chord visualization coming soon
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};