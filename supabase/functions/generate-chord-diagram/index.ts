import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChordPosition {
  string_number: string
  fret_position: number | null
  string_state: 'muted' | 'open' | 'fretted'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { chord } = await req.json()
    
    if (!chord) {
      return new Response(
        JSON.stringify({ error: 'Chord parameter is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: positions, error } = await supabaseClient
      .from('chord_positions')
      .select('string_number, fret_position, string_state')
      .eq('chord_name', chord)
      .order('string_number')

    if (error) {
      console.error('Error fetching chord positions:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch chord positions' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Generate SVG
    const svg = generateChordDiagramSVG(positions)

    return new Response(
      JSON.stringify({ svg }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function generateChordDiagramSVG(positions: ChordPosition[]) {
  const width = 200
  const height = 250
  const fretHeight = 40
  const stringSpacing = 20
  const topMargin = 40
  const leftMargin = 40
  
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .fret-text { font: 12px sans-serif; }
      .string-marker { font: bold 16px sans-serif; }
    </style>
    <rect x="${leftMargin-5}" y="${topMargin-5}" width="105" height="165" fill="white"/>
  `

  // Draw frets
  for (let i = 0; i <= 4; i++) {
    const y = topMargin + i * fretHeight
    svg += `<line x1="${leftMargin}" y1="${y}" x2="${leftMargin + 100}" y2="${y}" 
      stroke="black" stroke-width="${i === 0 ? 3 : 1}"/>`
    
    if (i > 0) {
      svg += `<text x="${leftMargin - 20}" y="${y + fretHeight/2}" 
        class="fret-text" text-anchor="middle" dominant-baseline="middle">${i}</text>`
    }
  }

  // Draw strings
  for (let i = 0; i < 6; i++) {
    const x = leftMargin + i * stringSpacing
    svg += `<line x1="${x}" y1="${topMargin}" x2="${x}" y2="${topMargin + 160}" 
      stroke="black" stroke-width="1"/>`
  }

  // Draw positions
  positions.forEach((pos) => {
    const stringIndex = 6 - parseInt(pos.string_number)
    const x = leftMargin + stringIndex * stringSpacing
    
    if (pos.string_state === 'muted') {
      svg += `<text x="${x}" y="${topMargin - 20}" 
        class="string-marker" text-anchor="middle">×</text>`
    } else if (pos.string_state === 'open') {
      svg += `<text x="${x}" y="${topMargin - 20}" 
        class="string-marker" text-anchor="middle">○</text>`
    } else if (pos.fret_position && pos.fret_position > 0) {
      const y = topMargin + (pos.fret_position - 0.5) * fretHeight
      svg += `<circle cx="${x}" cy="${y}" r="8" fill="#11245A"/>
        <text x="${x}" y="${y}" 
          fill="white" text-anchor="middle" dominant-baseline="middle"
          class="fret-text">${pos.fret_position}</text>`
    }
  })

  svg += '</svg>'
  return svg
}