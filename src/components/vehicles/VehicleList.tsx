
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import type { Vehicle } from '@/types/supabase-models';

interface VehicleListProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  onAddVehicle: () => void;
  onEditVehicle?: (vehicle: Vehicle) => void;
  onDeleteVehicle?: (vehicleId: string) => void;
}

const VehicleList = ({ 
  vehicles, 
  isLoading, 
  onAddVehicle, 
  onEditVehicle, 
  onDeleteVehicle 
}: VehicleListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = (vehicleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDeleteVehicle) return;

    if (confirm('Are you sure you want to delete this vehicle?')) {
      onDeleteVehicle(vehicleId);
    }
  };

  const handleEdit = (vehicle: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditVehicle) {
      onEditVehicle(vehicle);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-gray-100 rounded-t-lg" />
            <CardContent className="h-24 bg-gray-50" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Vehicles</h2>
        <Button onClick={onAddVehicle}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">You haven't added any vehicles yet.</p>
            <Button onClick={onAddVehicle}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Vehicle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="group hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
                    <CardDescription>
                      {vehicle.license_plate && `License Plate: ${vehicle.license_plate}`}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{vehicle.year}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate(`/vehicles/${vehicle.id}/invoices`)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Service History
                </Button>
                <div className="flex gap-2">
                  {onEditVehicle && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => handleEdit(vehicle, e)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                  {onDeleteVehicle && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => handleDelete(vehicle.id, e)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleList;
