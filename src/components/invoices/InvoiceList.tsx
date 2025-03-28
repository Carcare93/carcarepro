
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Download, Trash2 } from 'lucide-react';
import { Invoice } from '@/services/car-service';
import { format } from 'date-fns';

interface InvoiceListProps {
  invoices: Invoice[];
  isLoading: boolean;
  vehicleId: string;
  onAddInvoice: () => void;
  onDeleteInvoice: (invoiceId: string) => Promise<void>;
}

const InvoiceList = ({ 
  invoices, 
  isLoading, 
  vehicleId, 
  onAddInvoice,
  onDeleteInvoice 
}: InvoiceListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-12 bg-gray-100 rounded-t-lg" />
            <CardContent className="h-24 bg-gray-50" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Service History</h2>
        <Button onClick={onAddInvoice}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Invoice
        </Button>
      </div>

      {invoices.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">No service history found for this vehicle.</p>
            <Button onClick={onAddInvoice}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add First Service Record
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {format(new Date(invoice.date), 'MMMM d, yyyy')}
                  </CardTitle>
                  <Badge variant={invoice.paid ? "success" : "secondary"}>
                    {invoice.paid ? "Paid" : "Unpaid"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Services Performed</h4>
                    <div className="flex flex-wrap gap-2">
                      {invoice.services.map((service, index) => (
                        <Badge key={index} variant="outline">{service}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t pt-4">
                    <div className="font-medium">
                      Total: {formatCurrency(invoice.amount)}
                    </div>
                    <div className="flex space-x-2">
                      {invoice.fileUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={invoice.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </a>
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDeleteInvoice(invoice.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
