
import React, { useState } from 'react';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface AddInvoiceFormData {
  date: Date;
  amount: number;
  description: string;
  paid: boolean;
  fileUrl?: string;
}

interface AddInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  vehicleId: string;
  serviceProviderId: string;
  onAddInvoice: (data: AddInvoiceFormData & { services: string[] }) => Promise<void>;
}

const AddInvoiceDialog = ({ 
  open, 
  onClose, 
  vehicleId,
  serviceProviderId,
  onAddInvoice 
}: AddInvoiceDialogProps) => {
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = 
    useForm<AddInvoiceFormData>({
      defaultValues: {
        date: new Date(),
        paid: true
      }
    });
  const { toast } = useToast();
  const selectedDate = watch('date');

  const addService = () => {
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const onSubmit = async (data: AddInvoiceFormData) => {
    if (services.length === 0) {
      toast({
        title: "Missing services",
        description: "Please add at least one service.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onAddInvoice({
        ...data,
        services
      });
      reset();
      setServices([]);
      toast({
        title: "Invoice added",
        description: "The service record has been added successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem adding the service record.",
        variant: "destructive",
      });
    }
  };

  const onDialogClose = () => {
    reset();
    setServices([]);
    setNewService('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onDialogClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Service Record</DialogTitle>
          <DialogDescription>
            Add details of the service performed on your vehicle.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label htmlFor="date">Service Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setValue('date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Services Performed</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Oil Change"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                />
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={addService} 
                  disabled={!newService.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {services.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {services.map((service, index) => (
                    <Badge 
                      key={index}
                      className="flex items-center gap-1 pl-2 pr-1 py-1" 
                      variant="secondary"
                    >
                      {service}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 p-0 hover:bg-transparent"
                        onClick={() => removeService(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              {services.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">Please add at least one service</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount", { 
                  required: "Amount is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Amount cannot be negative" }
                })}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter service details or notes"
                {...register("description")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fileUrl">Invoice URL (Optional)</Label>
              <Input
                id="fileUrl"
                placeholder="https://example.com/invoice.pdf"
                {...register("fileUrl")}
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL to the invoice file (PDF, image, etc.)
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="paid"
                checked={watch('paid')}
                onCheckedChange={(checked) => {
                  setValue('paid', checked as boolean);
                }}
              />
              <Label htmlFor="paid" className="cursor-pointer">
                Mark as paid
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onDialogClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvoiceDialog;
