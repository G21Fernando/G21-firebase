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

    // Generate SVG with new specifications
    const svg = generateChordDiagramSVG(positions, chord)

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

function generateChordDiagramSVG(positions: ChordPosition[], chordName: string) {
  const width = 300
  const height = 400
  const stringSpacing = 48
  const fretSpacing = 48
  const leftMargin = 30
  const topMargin = 80
  const stringLength = 240 // 270 - 30 from specs
  const fretLength = 240 // 320 - 80 from specs

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .chord-name { font: bold 32px sans-serif; }
      .string-marker { font: bold 28px sans-serif; }
    </style>
    
    <!-- Chord Name -->
    <text x="${width/2}" y="40" 
      class="chord-name" 
      text-anchor="middle" 
      fill="#000000">${chordName}</text>

    <!-- Background for better visibility -->
    <rect x="${leftMargin-10}" y="${topMargin-30}" 
      width="${stringLength+20}" height="${fretLength+40}" 
      fill="white"/>
  `

  // Draw fret lines (horizontal)
  for (let i = 0; i <= 4; i++) {
    const y = topMargin + i * fretSpacing
    svg += `<line x1="${leftMargin}" y1="${y}" 
      x2="${leftMargin + stringLength}" y2="${y}" 
      stroke="#000000" 
      stroke-width="${i === 0 ? 5 : 3}"/>`
  }

  // Draw strings (vertical)
  for (let i = 0; i < 6; i++) {
    const x = leftMargin + i * stringSpacing
    svg += `<line x1="${x}" y1="${topMargin}" 
      x2="${x}" y2="${topMargin + fretLength}" 
      stroke="#000000" 
      stroke-width="3"/>`
  }

  // Draw positions
  positions.forEach((pos) => {
    const stringIndex = 6 - parseInt(pos.string_number)
    const x = leftMargin + stringIndex * stringSpacing
    
    if (pos.string_state === 'muted') {
      // Draw X above nut
      svg += `<text x="${x}" y="${topMargin - 15}" 
        class="string-marker" 
        text-anchor="middle" 
        fill="#000000">×</text>`
    } else if (pos.string_state === 'open') {
      // Draw O above nut
      svg += `<text x="${x}" y="${topMargin - 15}" 
        class="string-marker" 
        text-anchor="middle" 
        fill="#000000">○</text>`
    } else if (pos.fret_position && pos.fret_position > 0) {
      // Draw finger position dot
      const y = topMargin + ((pos.fret_position - 0.5) * fretSpacing)
      svg += `<circle cx="${x}" cy="${y}" r="12.5" fill="#000000"/>
        <text x="${x}" y="${y}" 
          fill="white" 
          text-anchor="middle" 
          dominant-baseline="middle" 
          class="string-marker">${pos.fret_position}</text>`
    }
  })

  svg += '</svg>'
  return svg
}