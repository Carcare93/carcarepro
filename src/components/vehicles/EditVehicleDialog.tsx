
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import type { Vehicle } from '@/types/supabase-models';

interface EditVehicleFormData {
  make: string;
  model: string;
  year: number;
  license_plate?: string;
  color?: string;
}

interface EditVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdateVehicle: (vehicleId: string, data: Partial<Vehicle>) => Promise<void>;
  vehicle: Vehicle | null;
}

const EditVehicleDialog = ({ open, onClose, onUpdateVehicle, vehicle }: EditVehicleDialogProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<EditVehicleFormData>();
  const { toast } = useToast();

  // Reset the form when the vehicle changes
  React.useEffect(() => {
    if (vehicle && open) {
      reset({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        license_plate: vehicle.license_plate || '',
        color: vehicle.color || '',
      });
    }
  }, [vehicle, reset, open]);

  const onSubmit = async (data: EditVehicleFormData) => {
    if (!vehicle) {
      toast({
        title: "Error",
        description: "Vehicle information is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Transform form data to match the Vehicle type
      const vehicleData = {
        make: data.make,
        model: data.model,
        year: Number(data.year),
        license_plate: data.license_plate,
        color: data.color,
      };
      
      await onUpdateVehicle(vehicle.id, vehicleData);
      onClose();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        title: "Error",
        description: "There was a problem updating your vehicle.",
        variant: "destructive",
      });
    }
  };

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit vehicle details</DialogTitle>
          <DialogDescription>
            Update your vehicle information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 my-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  placeholder="e.g. Toyota"
                  {...register("make", { required: "Make is required" })}
                />
                {errors.make && (
                  <p className="text-sm text-red-500">{errors.make.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g. Camry"
                  {...register("model", { required: "Model is required" })}
                />
                {errors.model && (
                  <p className="text-sm text-red-500">{errors.model.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="e.g. 2020"
                  {...register("year", { 
                    required: "Year is required",
                    valueAsNumber: true,
                    min: { 
                      value: 1900, 
                      message: "Year must be after 1900" 
                    },
                    max: { 
                      value: new Date().getFullYear() + 1, 
                      message: `Year must be before ${new Date().getFullYear() + 1}` 
                    }
                  })}
                />
                {errors.year && (
                  <p className="text-sm text-red-500">{errors.year.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_plate">License Plate (Optional)</Label>
                <Input
                  id="license_plate"
                  placeholder="e.g. ABC123"
                  {...register("license_plate")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color (Optional)</Label>
              <Input
                id="color"
                placeholder="e.g. Blue"
                {...register("color")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Vehicle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleDialog;
