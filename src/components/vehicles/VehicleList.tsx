
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Vehicle } from '@/services/car-service';

interface VehicleListProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  onAddVehicle: () => void;
}

const VehicleList = ({ vehicles, isLoading, onAddVehicle }: VehicleListProps) => {
  const navigate = useNavigate();

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
                      {vehicle.licensePlate && `License Plate: ${vehicle.licensePlate}`}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{vehicle.year}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate(`/vehicles/${vehicle.id}/invoices`)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Service History
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleList;
