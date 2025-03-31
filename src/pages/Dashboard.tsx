
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">My Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">2</p>
                  <p className="text-muted-foreground text-sm">Upcoming appointments</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">My Vehicles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">3</p>
                  <p className="text-muted-foreground text-sm">Registered vehicles</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">5</p>
                  <p className="text-muted-foreground text-sm">Completed services</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Oil Change</h3>
                      <p className="text-sm text-muted-foreground">Auto Service Center</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">June 15, 2023</p>
                      <p className="text-sm text-muted-foreground">10:00 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Tire Rotation</h3>
                      <p className="text-sm text-muted-foreground">Quick Fix Auto</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">June 22, 2023</p>
                      <p className="text-sm text-muted-foreground">2:30 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Your booking information would appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vehicles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Your vehicle information would appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Your account settings would appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
