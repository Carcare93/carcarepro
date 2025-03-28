
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carService, Invoice } from '@/services/car-service';
import InvoiceList from '@/components/invoices/InvoiceList';
import AddInvoiceDialog from '@/components/invoices/AddInvoiceDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VehicleInvoices = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!vehicleId) {
    navigate('/vehicles');
    return null;
  }

  const {
    data: vehicle,
    isLoading: isLoadingVehicle,
  } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: async () => {
      const vehicles = await carService.getUserVehicles();
      return vehicles.find(v => v.id === vehicleId);
    },
    enabled: !!vehicleId,
  });

  const {
    data: invoices = [],
    isLoading: isLoadingInvoices,
  } = useQuery({
    queryKey: ['invoices', vehicleId],
    queryFn: () => carService.getVehicleInvoices(vehicleId),
    enabled: !!vehicleId,
  });

  const addInvoiceMutation = useMutation({
    mutationFn: (newInvoice: Omit<Invoice, 'id'>) => {
      return carService.addInvoice(newInvoice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', vehicleId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add service record. Please try again.',
        variant: 'destructive',
      });
      console.error('Add invoice error:', error);
    },
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: (invoiceId: string) => {
      return carService.deleteInvoice(invoiceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', vehicleId] });
      toast({
        title: 'Invoice deleted',
        description: 'The service record has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete service record. Please try again.',
        variant: 'destructive',
      });
      console.error('Delete invoice error:', error);
    },
  });

  const handleAddInvoice = async (data: any) => {
    const newInvoice: Omit<Invoice, 'id'> = {
      vehicleId,
      serviceProviderId: 'service-provider-1', // Placeholder, in a real app this would be selected
      date: data.date.toISOString(),
      amount: data.amount,
      description: data.description,
      services: data.services,
      paid: data.paid,
      fileUrl: data.fileUrl,
    };
    
    await addInvoiceMutation.mutateAsync(newInvoice);
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this service record?')) {
      await deleteInvoiceMutation.mutateAsync(invoiceId);
    }
  };

  const isLoading = isLoadingVehicle || isLoadingInvoices;

  return (
    <>
      <Helmet>
        <title>Service History | Car Care</title>
      </Helmet>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/vehicles')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to My Vehicles
        </Button>
        
        {vehicle && (
          <h1 className="text-3xl font-bold mb-6">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
        )}

        <InvoiceList
          invoices={invoices}
          isLoading={isLoading}
          vehicleId={vehicleId}
          onAddInvoice={() => setIsAddInvoiceOpen(true)}
          onDeleteInvoice={handleDeleteInvoice}
        />

        <AddInvoiceDialog
          open={isAddInvoiceOpen}
          onClose={() => setIsAddInvoiceOpen(false)}
          vehicleId={vehicleId}
          serviceProviderId="service-provider-1" // Placeholder
          onAddInvoice={handleAddInvoice}
        />
      </div>
    </>
  );
};

export default VehicleInvoices;
