
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Vehicle, carService } from '@/services/car-service';
import VehicleList from '@/components/vehicles/VehicleList';
import AddVehicleDialog from '@/components/vehicles/AddVehicleDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';

const Vehicles = () => {
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: vehicles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['vehicles', user?.id],
    queryFn: () => carService.getUserVehicles(),
    enabled: !!user,
  });

  const addVehicleMutation = useMutation({
    mutationFn: (newVehicle: Omit<Vehicle, 'id'>) => {
      return carService.addVehicle({
        ...newVehicle,
        userId: user?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add vehicle. Please try again.',
        variant: 'destructive',
      });
      console.error('Add vehicle error:', error);
    },
  });

  const handleAddVehicle = async (vehicle: Omit<Vehicle, 'id'>) => {
    await addVehicleMutation.mutateAsync(vehicle);
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
