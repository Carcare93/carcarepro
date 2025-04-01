
import { useQuery } from '@tanstack/react-query';
import { supabaseService } from '@/services/supabase-service';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for fetching users from Supabase
 */
export const useUsers = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        return await supabaseService.getUsers();
      } catch (error) {
        toast({
          title: 'Error fetching users',
          description: 'Could not load user data',
          variant: 'destructive',
        });
        throw error;
      }
    },
  });
};
