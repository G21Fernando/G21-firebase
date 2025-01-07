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
  // Simplified dimensions for a cleaner look
  const width = 80
  const height = 100
  const stringSpacing = 12
  const fretSpacing = 16
  const leftMargin = 10
  const topMargin = 20
  const stringLength = 64 // 4 frets * 16
  const fretLength = 60 // 5 strings * 12

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect x="${leftMargin-5}" y="${topMargin-5}" 
      width="${stringLength+10}" height="${fretLength+10}" 
      fill="white"/>
  `

  // Draw fret lines (horizontal) - 5 lines for 4 frets
  for (let i = 0; i <= 4; i++) {
    const y = topMargin + i * fretSpacing
    svg += `<line x1="${leftMargin}" y1="${y}" 
      x2="${leftMargin + stringLength}" y2="${y}" 
      stroke="black" 
      stroke-width="${i === 0 ? 2 : 1}"/>`
  }

  // Draw strings (vertical)
  for (let i = 0; i < 6; i++) {
    const x = leftMargin + i * stringSpacing
    svg += `<line x1="${x}" y1="${topMargin}" 
      x2="${x}" y2="${topMargin + fretLength}" 
      stroke="black" 
      stroke-width="1"/>`
  }

  // Draw positions
  positions.forEach((pos) => {
    const stringIndex = 6 - parseInt(pos.string_number)
    const x = leftMargin + stringIndex * stringSpacing
    
    if (pos.string_state === 'muted') {
      // Draw X above nut
      svg += `<text x="${x}" y="${topMargin - 5}" 
        font-family="sans-serif"
        font-size="12px"
        text-anchor="middle" 
        fill="black">×</text>`
    } else if (pos.string_state === 'open') {
      // Draw O above nut
      svg += `<text x="${x}" y="${topMargin - 5}" 
        font-family="sans-serif"
        font-size="12px"
        text-anchor="middle" 
        fill="black">○</text>`
    } else if (pos.fret_position && pos.fret_position > 0 && pos.fret_position <= 4) {
      // Draw finger position dot
      const y = topMargin + ((pos.fret_position - 0.5) * fretSpacing)
      svg += `<circle cx="${x}" cy="${y}" r="4" fill="black"/>`
    }
  })

  svg += '</svg>'
  return svg
}