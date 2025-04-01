
import React, { useState } from 'react';
import VehicleList from '@/components/vehicles/VehicleList';
import AddVehicleDialog from '@/components/vehicles/AddVehicleDialog';
import EditVehicleDialog from '@/components/vehicles/EditVehicleDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';
import { 
  useVehicles, 
  useCreateVehicle, 
  useUpdateVehicle, 
  useDeleteVehicle 
} from '@/hooks/api/useVehicles';
import type { Vehicle } from '@/types/supabase-models';

const Vehicles = () => {
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isEditVehicleOpen, setIsEditVehicleOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    data: vehicles = [],
    isLoading,
    error,
  } = useVehicles();

  const addVehicleMutation = useCreateVehicle();
  const updateVehicleMutation = useUpdateVehicle();
  const deleteVehicleMutation = useDeleteVehicle();

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

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditVehicleOpen(true);
  };

  const handleUpdateVehicle = async (vehicleId: string, vehicleData: Partial<Vehicle>) => {
    await updateVehicleMutation.mutateAsync({ vehicleId, vehicleData });
    setIsEditVehicleOpen(false);
    setSelectedVehicle(null);
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      await deleteVehicleMutation.mutateAsync(vehicleId);
      toast({
        title: 'Success',
        description: 'Vehicle successfully deleted.'
      });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete vehicle. Please try again.',
        variant: 'destructive',
      });
    }
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
          onEditVehicle={handleEditVehicle}
          onDeleteVehicle={handleDeleteVehicle}
        />

        <AddVehicleDialog
          open={isAddVehicleOpen}
          onClose={() => setIsAddVehicleOpen(false)}
          onAddVehicle={handleAddVehicle}
        />

        <EditVehicleDialog
          open={isEditVehicleOpen}
          onClose={() => {
            setIsEditVehicleOpen(false);
            setSelectedVehicle(null);
          }}
          onUpdateVehicle={handleUpdateVehicle}
          vehicle={selectedVehicle}
        />
      </div>
    </>
  );
};

export default Vehicles;
