import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ChordPair = Database['public']['Enums']['chord_pair'];

// Cache object to store chord diagrams
const chordDiagramCache: { [key: string]: string } = {};

export const useChordDiagrams = (isActive: boolean, isPaused: boolean) => {
  const chordPairs: ChordPair[] = ['Am-C', 'Em-G', 'Dm-G', 'Am-F', 'C-G', 'Em-Am'];
  const [currentPair, setCurrentPair] = useState<ChordPair | null>(null);
  const [leftChordSvg, setLeftChordSvg] = useState<string>('');
  const [rightChordSvg, setRightChordSvg] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const fetchChordDiagram = useCallback(async (chord: string) => {
    console.log('Fetching chord diagram for:', chord);
    
    if (chordDiagramCache[chord]) {
      console.log('Using cached diagram for:', chord);
      return chordDiagramCache[chord];
    }

    const response = await supabase.functions.invoke('generate-chord-diagram', {
      body: { chord }
    });
    
    if (response.error) {
      console.error('Error fetching chord diagram:', response.error);
      throw response.error;
    }
    
    console.log('Successfully fetched diagram for:', chord);
    chordDiagramCache[chord] = response.data.svg;
    return response.data.svg;
  }, []);

  useEffect(() => {
    if (isActive && !isPaused && !isLoading) {
      setIsLoading(true);
      console.log('Setting new chord pair');
      const randomIndex = Math.floor(Math.random() * chordPairs.length);
      setCurrentPair(chordPairs[randomIndex]);
      setIsReady(false);
    } else if (!isActive) {
      console.log('Resetting chord pair');
      setCurrentPair(null);
      setLeftChordSvg('');
      setRightChordSvg('');
      setIsReady(false);
      setIsLoading(false);
    }
  }, [isActive, isPaused, isLoading, chordPairs]);

  useEffect(() => {
    const loadChordDiagrams = async () => {
      if (!currentPair) return;
      
      console.log('Loading chord diagrams for pair:', currentPair);
      const [leftChord, rightChord] = currentPair.split('-');
      
      try {
        const [leftSvg, rightSvg] = await Promise.all([
          fetchChordDiagram(leftChord),
          fetchChordDiagram(rightChord)
        ]);

        setLeftChordSvg(leftSvg);
        setRightChordSvg(rightSvg);
        setIsReady(true);
        setIsLoading(false);
        console.log('Successfully loaded both chord diagrams');
      } catch (error) {
        console.error('Error loading chord diagrams:', error);
        setIsLoading(false);
      }
    };

    loadChordDiagrams();
  }, [currentPair, fetchChordDiagram]);

  return {
    currentPair,
    leftChordSvg,
    rightChordSvg,
    isLoading,
    isReady,
    chordPairs,
  };
};