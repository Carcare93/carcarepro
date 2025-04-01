
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import VehicleList from '@/components/vehicles/VehicleList';
import AddVehicleDialog from '@/components/vehicles/AddVehicleDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';
import { useVehicles, useCreateVehicle } from '@/hooks/api/useVehicles';
import type { Vehicle } from '@/types/supabase-models';

const Vehicles = () => {
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: vehicles = [],
    isLoading,
    error,
  } = useVehicles();

  const addVehicleMutation = useCreateVehicle();

  const handleAddVehicle = async (vehicle: Omit<Vehicle, 'id' | 'user_id'>) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add a vehicle.',
        variant: 'destructive',
      });
      return;
    }
    
    await addVehicleMutation.mutateAsync({
      ...vehicle,
      user_id: user.id,
    });
    
    setIsAddVehicleOpen(false);
  };

  if (error) {
    console.error('Failed to load vehicles:', error);
    toast({
      title: 'Error',
      description: 'Failed to load vehicles. Please try again.',
      variant: 'destructive',
    });
  }

  return (
    <>
      <Helmet>
        <title>My Vehicles | Car Care</title>
      </Helmet>
      <div className="container mx-auto py-8 px-4">
        <VehicleList
          vehicles={vehicles}
          isLoading={isLoading}
          onAddVehicle={() => setIsAddVehicleOpen(true)}
        />

        <AddVehicleDialog
          open={isAddVehicleOpen}
          onClose={() => setIsAddVehicleOpen(false)}
          onAddVehicle={handleAddVehicle}
        />
      </div>
    </>
  );
};

export default Vehicles;
