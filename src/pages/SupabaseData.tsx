
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookings, useDeleteBooking } from '@/hooks/api/useBookings';
import { useServices } from '@/hooks/api/useServices';
import { useUsers } from '@/hooks/api/useUsers';
import DataTable from '@/components/supabase/DataTable';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const SupabaseData = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { data: bookings, isLoading: isLoadingBookings } = useBookings();
  const { data: services, isLoading: isLoadingServices } = useServices();
  const { data: users, isLoading: isLoadingUsers } = useUsers();
  const deleteBooking = useDeleteBooking();
  
  const bookingColumns = [
    { key: 'id', header: 'ID' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'pending' ? 'outline' : value === 'confirmed' ? 'default' : 'secondary'}>
          {value || 'N/A'}
        </Badge>
      )
    },
    { 
      key: 'appointment_time', 
      header: 'Appointment Time',
      render: (value: string) => value ? format(new Date(value), 'PPP p') : 'N/A'
    },
    { key: 'customer_id', header: 'Customer ID' },
    { key: 'provider_id', header: 'Provider ID' },
  ];
  
  const serviceColumns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { 
      key: 'price', 
      header: 'Price',
      render: (value: number) => value ? `$${value.toFixed(2)}` : 'N/A'
    },
    { 
      key: 'duration', 
      header: 'Duration',
      render: (value: number) => value ? `${value} min` : 'N/A'
    },
  ];
  
  const userColumns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'phone', header: 'Phone' },
  ];
  
  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };
  
  const handleDeleteBooking = (booking: any) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteBooking.mutate(booking.id);
    }
  };
  
  return (
    <div className="container mx-auto py-24">
      <h1 className="text-3xl font-bold mb-6">Supabase Data</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>
                Manage your bookings from Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={bookings || []} 
                columns={bookingColumns} 
                isLoading={isLoadingBookings}
                onEdit={handleViewDetails}
                onDelete={handleDeleteBooking}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>
                View all available services from Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={services || []} 
                columns={serviceColumns} 
                isLoading={isLoadingServices}
                onEdit={handleViewDetails}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                View all users from Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={users || []} 
                columns={userColumns} 
                isLoading={isLoadingUsers}
                onEdit={handleViewDetails}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedItem && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Item Details</DialogTitle>
              <DialogDescription>
                Detailed information about the selected item
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {Object.entries(selectedItem).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4">
                  <div className="font-medium">{key}</div>
                  <div className="col-span-2">{String(value || '-')}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SupabaseData;
