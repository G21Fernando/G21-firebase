import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChordLibrary } from "./ChordLibrary";

export const G21Assets = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">G21 Assets</h2>
      <Tabs defaultValue="chords" className="w-full">
        <TabsList>
          <TabsTrigger value="chords">Chord Library</TabsTrigger>
          <TabsTrigger value="other">Other Assets</TabsTrigger>
        </TabsList>
        <TabsContent value="chords">
          <ChordLibrary />
        </TabsContent>
        <TabsContent value="other">
          <div className="text-muted-foreground">
            More asset management features coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};