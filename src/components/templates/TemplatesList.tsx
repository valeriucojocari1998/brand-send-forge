import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import { useState } from "react";

const categories = [
  {
    id: "operational",
    name: "🚛 Operational Workflows",
    description: "Load management, dispatch, carrier communications, cancellations",
    color: "bg-blue-600 text-white",
    templates: [
      {
        id: "1",
        name: "Load Released",
        subject: "Load {{LoadID}} Released - Ready for Pickup from {{PickupLocation}}",
        category: "operational",
        description: "Automated notification when load is released and ready for carrier pickup",
        status: "active" as const,
        lastModified: "2 hours ago",
        variables: ["LoadID", "CarrierName", "PickupLocation", "PickupDate", "DeliveryLocation", "DeliveryDate", "LoadWeight", "SpecialInstructions"]
      },
      {
        id: "2",
        name: "Load Cancellation - Carrier",
        subject: "URGENT: Load {{LoadID}} Cancelled - {{CancellationReason}}",
        category: "operational",
        description: "Automatic notification to carriers when broker cancels a load",
        status: "active" as const,
        lastModified: "1 hour ago",
        variables: ["LoadID", "CarrierName", "CancellationReason", "CancellationTime", "ContactPerson", "ContactPhone", "AlternativeLoads"]
      },
      {
        id: "3",
        name: "Load Cancellation - Broker",
        subject: "Carrier Cancellation Alert - Load {{LoadID}}",
        category: "operational",
        description: "Alert to broker when carrier cancels/bounces off a load",
        status: "active" as const,
        lastModified: "30 minutes ago",
        variables: ["LoadID", "CarrierName", "CancellationReason", "TimeToPickup", "ReplacementNeeded", "CustomerImpact"]
      },
      {
        id: "4",
        name: "Paperwork/BOL Request",
        subject: "Paperwork Required - Load {{LoadID}} Documentation",
        category: "operational",
        description: "Auto-populated carrier email for requesting Bills of Lading and paperwork",
        status: "active" as const,
        lastModified: "3 hours ago",
        variables: ["LoadID", "CarrierEmail", "RequiredDocs", "DueDate", "SubmissionMethod", "ContactPerson"]
      },
      {
        id: "5",
        name: "Driver Check-In/Out",
        subject: "Driver {{DriverName}} - {{CheckType}} at {{Location}}",
        category: "operational",
        description: "Real-time notifications for driver location updates and status changes",
        status: "active" as const,
        lastModified: "45 minutes ago",
        variables: ["DriverName", "CheckType", "Location", "Timestamp", "LoadID", "NextStop", "ETA"]
      },
      {
        id: "6",
        name: "Dispatch Assignment",
        subject: "New Load Assignment - {{LoadID}} | Priority: {{Priority}}",
        category: "operational",
        description: "Automated dispatch notifications with load details and routing",
        status: "active" as const,
        lastModified: "2 hours ago",
        variables: ["LoadID", "DriverName", "Priority", "PickupAddress", "DeliveryAddress", "Miles", "Rate", "SpecialRequirements"]
      }
    ]
  },
  {
    id: "financial",
    name: "💰 Financial & Settlements",
    description: "Invoicing, payments, detention, factoring, settlements",
    color: "bg-green-600 text-white",
    templates: [
      {
        id: "7",
        name: "Custom Invoice Template",
        subject: "Invoice {{InvoiceID}} - {{CustomerName}} | Due: {{DueDate}}",
        category: "financial",
        description: "Customizable invoice emails with customer-specific branding and content",
        status: "active" as const,
        lastModified: "1 hour ago",
        variables: ["InvoiceID", "CustomerName", "InvoiceAmount", "DueDate", "ServicePeriod", "PaymentTerms", "RemittanceAddress"]
      },
      {
        id: "8",
        name: "Factoring Company Invoice",
        subject: "{{CustomerName}} - Invoice {{InvoiceID}} for Factoring Review",
        category: "financial",
        description: "Specialized invoice format for factoring companies with customer name in subject",
        status: "active" as const,
        lastModified: "30 minutes ago",
        variables: ["CustomerName", "InvoiceID", "LoadID", "InvoiceAmount", "CarrierName", "ServiceDate", "FactoringReference"]
      },
      {
        id: "9",
        name: "Detention Notice",
        subject: "Detention Charges Applied - Load {{LoadID}} | ${{Amount}}",
        category: "financial",
        description: "Automated detention charge notifications with detailed breakdown",
        status: "active" as const,
        lastModified: "2 hours ago",
        variables: ["LoadID", "CarrierName", "DetentionHours", "Amount", "Rate", "Location", "StartTime", "EndTime"]
      },
      {
        id: "10",
        name: "Quick Pay Confirmation",
        subject: "Quick Pay Processed - ${{Amount}} | Ref: {{TransactionID}}",
        category: "financial",
        description: "Instant payment confirmations with transaction details",
        status: "active" as const,
        lastModified: "1 hour ago",
        variables: ["Amount", "TransactionID", "LoadID", "ProcessedDate", "CarrierName", "Fee", "NetAmount"]
      },
      {
        id: "11",
        name: "Settlement Statement",
        subject: "Weekly Settlement - {{WeekEnding}} | Total: ${{TotalAmount}}",
        category: "financial",
        description: "Comprehensive weekly settlement statements for carriers",
        status: "active" as const,
        lastModified: "4 hours ago",
        variables: ["WeekEnding", "TotalAmount", "TotalLoads", "TotalMiles", "FuelCharges", "Deductions", "NetPay"]
      }
    ]
  },
  {
    id: "marketplace",
    name: "🏪 Marketplace",
    description: "Load postings, broker communications, rate confirmations",
    color: "bg-purple-600 text-white",
    templates: [
      {
        id: "12",
        name: "Rate Confirmation",
        subject: "Rate Confirmation - Load {{LoadID}} | ${{Rate}}",
        category: "marketplace",
        description: "Automated rate confirmations with multiple CC recipients support",
        status: "active" as const,
        lastModified: "1 hour ago",
        variables: ["LoadID", "Rate", "PickupDate", "DeliveryDate", "CarrierName", "Miles", "RatePerMile", "FuelSurcharge"]
      },
      {
        id: "13",
        name: "Load Posting Alert",
        subject: "New Load Available - {{Origin}} to {{Destination}} | ${{Rate}}",
        category: "marketplace",
        description: "Automated alerts for new load postings matching carrier preferences",
        status: "active" as const,
        lastModified: "30 minutes ago",
        variables: ["Origin", "Destination", "Rate", "PickupDate", "LoadType", "Weight", "Equipment", "Miles"]
      },
      {
        id: "14",
        name: "Carrier Packet Complete",
        subject: "Carrier Packet Completed - {{CarrierName}}",
        category: "marketplace",
        description: "Notification when carrier completes onboarding packet with configurable recipient",
        status: "active" as const,
        lastModified: "2 hours ago",
        variables: ["CarrierName", "CompletionDate", "PacketType", "NextSteps", "ContactPerson", "AuthorityNumber"]
      },
      {
        id: "15",
        name: "Broker Communication",
        subject: "Load Update - {{LoadID}} | {{MessageType}}",
        category: "marketplace",
        description: "Pre-populated broker emails for PODs, lumper receipts, and documentation",
        status: "active" as const,
        lastModified: "45 minutes ago",
        variables: ["LoadID", "MessageType", "BrokerName", "AttachmentType", "LoadStatus", "Notes", "RequiredAction"]
      }
    ]
  },
  {
    id: "onboarding",
    name: "👨‍💼 Onboarding",
    description: "New carrier setup, document collection, compliance verification",
    color: "bg-orange-600 text-white",
    templates: [
      {
        id: "16",
        name: "Welcome New Carrier",
        subject: "Welcome to {{CompanyName}} - Carrier Onboarding Started",
        category: "onboarding",
        description: "Welcome email for new carriers with onboarding checklist and requirements",
        status: "active" as const,
        lastModified: "3 hours ago",
        variables: ["CarrierName", "CompanyName", "OnboardingLink", "RequiredDocs", "ContactPerson", "Deadline"]
      },
      {
        id: "17",
        name: "Document Reminder",
        subject: "Action Required - Missing Documents for {{CarrierName}}",
        category: "onboarding",
        description: "Automated reminders for missing carrier documentation and compliance items",
        status: "active" as const,
        lastModified: "1 hour ago",
        variables: ["CarrierName", "MissingDocs", "DueDate", "ConsequenceText", "UploadLink", "ContactInfo"]
      },
      {
        id: "18",
        name: "Insurance Expiration",
        subject: "URGENT: Insurance Expiring Soon - {{CarrierName}}",
        category: "onboarding",
        description: "Proactive alerts for expiring insurance and compliance documents",
        status: "active" as const,
        lastModified: "2 hours ago",
        variables: ["CarrierName", "DocumentType", "ExpirationDate", "DaysRemaining", "RenewalInstructions", "SuspensionWarning"]
      },
      {
        id: "19",
        name: "Onboarding Complete",
        subject: "Congratulations! {{CarrierName}} Onboarding Complete",
        category: "onboarding",
        description: "Confirmation email when carrier completes full onboarding process",
        status: "active" as const,
        lastModified: "4 hours ago",
        variables: ["CarrierName", "CompletionDate", "CarrierID", "NextSteps", "AccountManager", "FirstLoadOpportunity"]
      },
      {
        id: "20",
        name: "Driver Qualification",
        subject: "Driver {{DriverName}} - Qualification Status Update",
        category: "onboarding",
        description: "Driver-specific qualification and document verification notifications",
        status: "active" as const,
        lastModified: "1 hour ago",
        variables: ["DriverName", "QualificationStatus", "CarrierName", "RequiredTraining", "CertificationDate", "NextReview"]
      }
    ]
  },
  {
    id: "notifications",
    name: "📧 System Notifications",
    description: "Paystubs, SMS alerts, system updates, compliance notifications",
    color: "bg-indigo-600 text-white",
    templates: [
      {
        id: "21",
        name: "Paystub Available",
        subject: "Paystub Ready - {{PayPeriod}} | {{EmployeeName}}",
        category: "notifications",
        description: "Customizable paystub notifications with employee-specific details",
        status: "active" as const,
        lastModified: "2 days ago",
        variables: ["PayPeriod", "EmployeeName", "GrossPay", "NetPay", "PayDate", "DirectDepositAccount", "StubLink"]
      },
      {
        id: "22",
        name: "SMS Message Alert",
        subject: "New SMS Message from {{SenderName}} - {{Preview}}",
        category: "notifications",
        description: "Email notifications for inbound SMS messages with disable option",
        status: "active" as const,
        lastModified: "1 hour ago",
        variables: ["SenderName", "SenderPhone", "Preview", "FullMessage", "ReceivedTime", "LoadReference"]
      },
      {
        id: "23",
        name: "Trip Report",
        subject: "Trip Report - {{TripID}} Completed | {{DriverName}}",
        category: "notifications",
        description: "Automated trip completion reports with fuel and performance metrics",
        status: "active" as const,
        lastModified: "6 hours ago",
        variables: ["TripID", "DriverName", "Distance", "Duration", "FuelUsed", "MPG", "StartLocation", "EndLocation"]
      }
    ]
  }
];

interface TemplatesListProps {
  onEditTemplate: (id: string) => void;
  onCreateTemplate: () => void;
}

export function TemplatesList({ onEditTemplate, onCreateTemplate }: TemplatesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handlePreview = (id: string) => {
    console.log("Preview template:", id);
  };

  const handleTest = (id: string) => {
    console.log("Test template:", id);
  };

  const handleDuplicate = (id: string) => {
    console.log("Duplicate template:", id);
  };

  const filteredCategories = categories.filter(category => {
    if (selectedCategory !== "all" && selectedCategory !== category.id) return false;
    
    if (searchQuery) {
      return category.templates.some(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Templates</h2>
          <p className="text-muted-foreground">Manage templates for different types of notifications</p>
        </div>
        <Button onClick={onCreateTemplate} className="bg-gradient-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Categories and Templates */}
      <div className="space-y-8">
        {filteredCategories.map((category) => {
          const filteredTemplates = category.templates.filter(template =>
            !searchQuery ||
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.subject.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredTemplates.length === 0) return null;

          return (
            <Card key={category.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={category.color}>
                      {category.name}
                    </Badge>
                    <div>
                      <CardTitle className="text-lg">{category.name} Templates</CardTitle>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onEdit={onEditTemplate}
                      onPreview={handlePreview}
                      onTest={handleTest}
                      onDuplicate={handleDuplicate}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No templates found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}