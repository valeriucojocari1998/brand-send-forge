import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VariableTooltipProps {
  variable: string;
  children: React.ReactNode;
}

const variableDescriptions: Record<string, string> = {
  // Load variables
  "LoadID": "Unique identifier for the load/shipment",
  "LoadWeight": "Total weight of the cargo in lbs",
  "PickupLocation": "Address or location for cargo pickup",
  "DeliveryLocation": "Final destination address for delivery",
  "PickupDate": "Scheduled date for cargo pickup",
  "DeliveryDate": "Scheduled date for cargo delivery",
  "SpecialInstructions": "Additional handling or delivery instructions",
  "LoadStatus": "Current status of the load (e.g., Dispatched, In Transit)",
  "PreviousStatus": "Previous status before current update",
  "OrderNumber": "Customer's purchase order or reference number",
  "PONumber": "Purchase order number from customer",
  "TotalBillable": "Total amount billable to customer",
  "CarrierTotalPayable": "Total amount payable to carrier",
  "SalesManager": "Assigned sales manager for this account",
  "AccountManager": "Dedicated account manager contact",
  "CustomerServiceRep": "Customer service representative assigned",
  "Dispatcher": "Dispatcher handling this load",
  
  // Status variables
  "Dispatched": "Load has been assigned and dispatched to carrier",
  "Cancelled": "Load has been cancelled",
  "Released": "Load is ready for pickup by carrier",
  "InTransit": "Load is currently being transported",
  "Delivered": "Load has been successfully delivered",
  "Invoiced": "Invoice has been generated for this load",
  "Completed": "Load and all associated tasks are complete",
  
  // Carrier variables
  "CarrierName": "Name of the transportation company",
  "CarrierEmail": "Primary email contact for carrier",
  "CarrierMC": "Motor Carrier number (MC#) for carrier",
  "DriverName": "Name of the assigned driver",
  "DriverEmails": "Driver's email address(es)",
  
  // Customer variables
  "Customer/Broker3PL": "Customer, broker, or 3PL company name",
  
  // Financial variables
  "InvoiceId": "Unique identifier for the invoice",
  "PaymentTerms": "Payment terms (e.g., Net 30, Quick Pay)",
  "InvoiceDueDate": "Date when payment is due"
};

export function VariableTooltip({ variable, children }: VariableTooltipProps) {
  const description = variableDescriptions[variable] || "Dynamic variable that will be replaced with actual data";
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <p className="font-medium">{variable}</p>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}