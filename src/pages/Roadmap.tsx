import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

const Roadmap = () => {
  const weeks = [
    {
      number: 1,
      days: [
        { day: 1, focus: "Basic Chords Introduction" },
        { day: 2, focus: "Chord Transitions" },
        { day: 3, focus: "Strumming Patterns" },
        { day: 4, focus: "Rhythm Practice" },
        { day: 5, focus: "Review & Challenge" },
      ]
    },
    {
      number: 2,
      days: [
        { day: 6, focus: "Advanced Chords" },
        { day: 7, focus: "Complex Transitions" },
        { day: 8, focus: "Fingerpicking Basics" },
        { day: 9, focus: "Song Structure" },
        { day: 10, focus: "Progress Check" },
      ]
    },
    {
      number: 3,
      days: [
        { day: 11, focus: "Barre Chords" },
        { day: 12, focus: "Speed Building" },
        { day: 13, focus: "Advanced Patterns" },
        { day: 14, focus: "Song Practice" },
        { day: 15, focus: "Performance Prep" },
      ]
    },
    {
      number: 4,
      days: [
        { day: 16, focus: "Advanced Techniques" },
        { day: 17, focus: "Full Songs" },
        { day: 18, focus: "Repertoire Building" },
        { day: 19, focus: "Performance Skills" },
        { day: 20, focus: "Final Rehearsal" },
      ]
    },
  ];

  return (
    <div className="min-h-screen pb-16 md:pb-0" style={{ backgroundColor: '#F5E6DB' }}>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">21-Day Guitar Journey</h1>
        
        <div className="space-y-8">
          {weeks.map((week) => (
            <div key={week.number} className="space-y-4">
              <h2 className="text-2xl font-semibold">Week {week.number}</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {week.days.map((day) => (
                  <Card key={day.day} className="p-4 hover:shadow-lg transition-shadow">
                    <h3 className="font-bold mb-2">Day {day.day}</h3>
                    <p className="text-sm text-gray-600">{day.focus}</p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Concert Day */}
        <div className="mt-8">
          <Card className="p-6 bg-purple-100 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-2">Day 21 - Concert Day! 🎸</h2>
            <p className="text-gray-700">
              Show off your progress and celebrate your achievement with a live performance!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;