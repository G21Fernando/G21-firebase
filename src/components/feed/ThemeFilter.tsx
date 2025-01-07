import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface ThemeFilterProps {
  onThemeSelect: (theme: string | null) => void;
  selectedTheme: string | null;
}

const ThemeFilter = ({ onThemeSelect, selectedTheme }: ThemeFilterProps) => {
  const [trendingThemes, setTrendingThemes] = useState<string[]>([]);

  useEffect(() => {
    const fetchTrendingThemes = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('themes')
        .not('themes', 'eq', '{}');

      if (error) {
        console.error('Error fetching themes:', error);
        return;
      }

      // Flatten all themes arrays and count occurrences
      const themeCounts = data.flatMap(post => post.themes).reduce((acc, theme) => {
        acc[theme] = (acc[theme] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Sort themes by count and get top 3
      const topThemes = Object.entries(themeCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([theme]) => theme);

      setTrendingThemes(topThemes);
    };

    fetchTrendingThemes();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sort by:</span>
      <div className="flex gap-2">
        {trendingThemes.map((theme) => (
          <Button
            key={theme}
            variant="outline"
            size="sm"
            className={`${
              selectedTheme === theme ? 'bg-gray-100' : ''
            }`}
            onClick={() => onThemeSelect(selectedTheme === theme ? null : theme)}
          >
            #{theme}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ThemeFilter;