import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChordPosition {
  chord_name: string;
  string_number: number;
  fret_position: number | null;
  string_state: 'fretted' | 'open' | 'muted';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { chord } = await req.json()
    console.log('Generating diagram for chord:', chord)

    // Fetch chord positions from the database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/chord_positions?chord_name=eq.${chord}`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const positions: ChordPosition[] = await response.json()
    console.log('Fetched positions:', positions)

    const svg = generateChordDiagramSVG(positions)
    
    return new Response(
      JSON.stringify({ svg }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    )
  }
})

function generateChordDiagramSVG(positions: ChordPosition[]) {
  const width = 100;
  const height = 105;
  const leftMargin = 20;
  const rightMargin = 20;
  const topMargin = 20;
  const fretSpacing = 20;
  const availableWidth = width - leftMargin - rightMargin;
  const stringSpacing = availableWidth / 5;
  const fretboardHeight = fretSpacing * 3;
  const dotRadius = 4;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`

  // Draw fret lines (horizontal)
  for (let i = 0; i <= 3; i++) {
    const y = topMargin + (i * fretSpacing);
    const lineWidth = i === 0 ? 2 : 1;
    
    svg += `<line 
      x1="${leftMargin}" 
      y1="${y}" 
      x2="${width - rightMargin}" 
      y2="${y}" 
      stroke="black" 
      stroke-width="${lineWidth}"/>`
  }

  // Draw strings (vertical lines)
  for (let i = 0; i < 6; i++) {
    const x = leftMargin + (i * stringSpacing);
    svg += `<line 
      x1="${x}" 
      y1="${topMargin}" 
      x2="${x}" 
      y2="${topMargin + fretboardHeight}" 
      stroke="black" 
      stroke-width="1"/>`
  }

  // Draw finger positions, open strings, and muted strings
  positions.forEach(pos => {
    const stringIndex = 6 - pos.string_number;
    const x = leftMargin + (stringIndex * stringSpacing);
    
    if (pos.string_state === 'muted') {
      // Draw X above the nut for muted strings
      svg += `<text 
        x="${x}" 
        y="${topMargin - 8}" 
        font-family="Arial" 
        font-size="12" 
        text-anchor="middle" 
        fill="black">×</text>`
    } else if (pos.string_state === 'open') {
      // Draw O above the nut for open strings
      svg += `<text 
        x="${x}" 
        y="${topMargin - 8}" 
        font-family="Arial" 
        font-size="12" 
        text-anchor="middle" 
        fill="black">○</text>`
    } else if (pos.fret_position && pos.fret_position > 0 && pos.fret_position <= 3) {
      // Draw filled circle for fretted positions
      const y = topMargin + ((pos.fret_position - 0.5) * fretSpacing);
      svg += `<circle 
        cx="${x}"
        cy="${y}"
        r="${dotRadius}"
        fill="black"/>`
    }
  });

  svg += '</svg>';
  return svg;
}