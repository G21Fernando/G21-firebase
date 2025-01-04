import React from 'react';
import { Award, CheckCircle, Circle } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

interface Exercise {
  id: string;
  name: string;
  level: number;
  order_in_level: number;
  status?: 'not_started' | 'in_progress' | 'completed';
}

export function ExerciseSidebar() {
  const session = useSession();

  const { data: exercises = [] } = useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const { data: exercises } = await supabase
        .from('exercises')
        .select('*')
        .order('level')
        .order('order_in_level');

      if (!session?.user?.id) return exercises || [];

      const { data: userExercises } = await supabase
        .from('user_exercises')
        .select('exercise_id, status')
        .eq('user_id', session.user.id);

      return exercises?.map(exercise => ({
        ...exercise,
        status: userExercises?.find(ue => ue.exercise_id === exercise.id)?.status || 'not_started'
      })) || [];
    },
  });

  const getExerciseIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Circle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-300" />;
    }
  };

  const exercisesByLevel = exercises.reduce((acc: Record<number, Exercise[]>, exercise) => {
    if (!acc[exercise.level]) {
      acc[exercise.level] = [];
    }
    acc[exercise.level].push(exercise);
    return acc;
  }, {});

  return (
    <Sidebar>
      <SidebarContent>
        {Object.entries(exercisesByLevel).map(([level, levelExercises]) => (
          <SidebarGroup key={level}>
            <SidebarGroupLabel>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Level {level}
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {levelExercises.map((exercise) => (
                  <SidebarMenuItem key={exercise.id}>
                    <SidebarMenuButton>
                      <div className="flex items-center gap-2">
                        {getExerciseIcon(exercise.status)}
                        <span>{exercise.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}