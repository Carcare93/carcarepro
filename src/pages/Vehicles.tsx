
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
    refetch
  } = useVehicles();

  const createVehicleMutation = useCreateVehicle();
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
    
    try {
      console.log('Adding vehicle with user_id:', user.id);
      await createVehicleMutation.mutateAsync({
        ...vehicle,
        user_id: user.id,
      });
      
      toast({
        title: 'Success',
        description: 'Vehicle successfully added.'
      });
      
      setIsAddVehicleOpen(false);
      refetch(); // Explicitly refetch after mutation
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: 'Error',
        description: 'Failed to add vehicle. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditVehicleOpen(true);
  };

  const handleUpdateVehicle = async (vehicleId: string, vehicleData: Partial<Vehicle>) => {
    try {
      console.log('Updating vehicle:', vehicleId, vehicleData);
      await updateVehicleMutation.mutateAsync({ vehicleId, vehicleData });
      
      toast({
        title: 'Success',
        description: 'Vehicle successfully updated.'
      });
      
      setIsEditVehicleOpen(false);
      setSelectedVehicle(null);
      refetch(); // Explicitly refetch after mutation
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vehicle. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      console.log('Deleting vehicle:', vehicleId);
      await deleteVehicleMutation.mutateAsync(vehicleId);
      toast({
        title: 'Success',
        description: 'Vehicle successfully deleted.'
      });
      refetch(); // Explicitly refetch after mutation
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
