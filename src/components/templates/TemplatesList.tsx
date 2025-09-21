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
    description: "Load status changes, driver notifications, delay alerts, dispatch automation",
    color: "bg-blue-600 text-white",
    templates: [
      {
        id: "1",
        name: "Load Status Change Notification",
        subject: "Load {{LoadID}} Status Updated: {{LoadStatus}}",
        category: "operational",
        description: "Triggered when load status changes (Dispatched, Cancelled, Released, etc.)",
        status: "active" as const,
        lastModified: "1 hour ago",
        variables: ["LoadID", "LoadStatus", "PreviousStatus", "AccountManager", "Dispatcher", "CarrierName", "CustomerName", "CustomerSalesRep"]
      },
      {
        id: "2",
        name: "Driver Check-In Notification",
        subject: "Driver {{DriverName}} Checked In at {{Location}}",
        category: "operational",
        description: "Automated notification when driver checks in at pickup/delivery location",
        status: "active" as const,
        lastModified: "2 hours ago",
        variables: ["LoadID", "DriverName", "CheckInTime", "Location", "LoadStatus", "Dispatcher", "CarrierName"]
      },
      {
        id: "3",
        name: "Driver Check-Out Notification",
        subject: "Driver {{DriverName}} Checked Out from {{Location}}",
        category: "operational",
        description: "Automated notification when driver checks out from pickup/delivery location",
        status: "active" as const,
        lastModified: "3 hours ago",
        variables: ["LoadID", "DriverName", "CheckOutTime", "Location", "LoadStatus", "Dispatcher", "NextDestination"]
      },
      {
        id: "4",
        name: "Delay Alert (Advanced Automation)",
        subject: "DELAY ALERT: Load {{LoadID}} - {{DelayReason}}",
        category: "operational",
        description: "Advanced automation triggered based on load status and delay conditions",
        status: "draft" as const,
        lastModified: "1 day ago",
        variables: ["LoadID", "DelayReason", "EstimatedDelay", "NewETA", "AccountManager", "CustomerSalesRep", "LoadStatus"]
      },
      {
        id: "5",
        name: "Load Assignment Notification",
        subject: "New Load Assignment - {{LoadID}} for {{DriverName}}",
        category: "operational",
        description: "Notification sent when load is assigned to carrier/driver",
        status: "active" as const,
        lastModified: "2 days ago",
        variables: ["LoadID", "CarrierName", "DriverName", "PickupLocation", "DeliveryLocation", "Dispatcher", "Rate"]
      }
    ]
  },
  {
    id: "financial",
    name: "💰 Financial & Settlements",
    description: "Driver payments, carrier settlements, quick pay, accounting notifications",
    color: "bg-green-600 text-white",
    templates: [
      // Driver Payments
      {
        id: "6",
        name: "Driver Statement Email",
        subject: "Driver Statement - {{StatementPeriod}} | {{DriverName}}",
        category: "financial",
        description: "Weekly/monthly statement for driver payments and settlements",
        status: "active" as const,
        lastModified: "3 hours ago",
        variables: ["DriverName", "StatementPeriod", "TotalEarnings", "TotalMiles", "PaymentDate", "StatementID", "CarrierName"]
      },
      {
        id: "7",
        name: "Quick Pay Notification",
        subject: "Quick Pay Processed - ${{Amount}} | {{LoadID}}",
        category: "financial",
        description: "Notification for expedited payment processing",
        status: "active" as const,
        lastModified: "1 day ago",
        variables: ["DriverName", "Amount", "LoadID", "PaymentDate", "TransactionID", "AccountManager", "Fee"]
      },
      {
        id: "8",
        name: "Payroll Generated Notification",
        subject: "Payroll Ready - {{PayPeriod}} | {{EmployeeName}}",
        category: "financial",
        description: "Notification when payroll has been processed",
        status: "active" as const,
        lastModified: "2 days ago",
        variables: ["EmployeeName", "PayPeriod", "GrossAmount", "NetAmount", "PayDate", "PayrollID", "Department"]
      },
      // Carrier Payments
      {
        id: "9",
        name: "Carrier Statement Email",
        subject: "Settlement Statement - {{StatementPeriod}} | {{CarrierName}}",
        category: "financial",
        description: "Settlement statement for carrier payments",
        status: "active" as const,
        lastModified: "4 hours ago",
        variables: ["CarrierName", "StatementPeriod", "TotalAmount", "PaymentTerms", "DueDate", "InvoiceID", "AccountManager"]
      },
      {
        id: "10",
        name: "Accounting Notification",
        subject: "Financial Transaction Alert - {{TransactionType}} | {{LoadID}}",
        category: "financial",
        description: "Financial transaction and accounting notifications",
        status: "active" as const,
        lastModified: "1 day ago",
        variables: ["TransactionType", "Amount", "LoadID", "CarrierName", "TransactionDate", "AccountManager", "CustomerName"]
      }
    ]
  },
  {
    id: "marketplace",
    name: "🏪 Marketplace",
    description: "Bidding workflow, load postings, carrier communications",
    color: "bg-purple-600 text-white",
    templates: [
      {
        id: "11",
        name: "Marketplace Bid Received",
        subject: "New Bid Received - Load {{LoadID}} | ${{BidAmount}}",
        category: "marketplace",
        description: "Notification when a new bid is received on marketplace load",
        status: "active" as const,
        lastModified: "2 hours ago",
        variables: ["LoadID", "CarrierName", "BidAmount", "PickupDate", "CustomerSalesRep", "BidID", "Rate"]
      },
      {
        id: "12",
        name: "Marketplace Bid Accepted",
        subject: "Bid Accepted - Load {{LoadID}} | {{CarrierName}}",
        category: "marketplace",
        description: "Notification when carrier bid is accepted",
        status: "active" as const,
        lastModified: "3 hours ago",
        variables: ["LoadID", "CarrierName", "AcceptedAmount", "CustomerName", "CustomerSalesRep", "BidID", "SalesManager"]
      },
      {
        id: "13",
        name: "Marketplace Bid Rejected",
        subject: "Bid Not Selected - Load {{LoadID}}",
        category: "marketplace",
        description: "Notification when carrier bid is rejected",
        status: "active" as const,
        lastModified: "1 day ago",
        variables: ["LoadID", "CarrierName", "BidAmount", "RejectionReason", "CustomerSalesRep", "BidID", "AlternativeLoads"]
      },
      {
        id: "14",
        name: "Marketplace Bid Updated",
        subject: "Bid Updated - Load {{LoadID}} | New Amount: ${{NewBidAmount}}",
        category: "marketplace",
        description: "Notification when bid details are modified",
        status: "active" as const,
        lastModified: "2 days ago",
        variables: ["LoadID", "CarrierName", "NewBidAmount", "PreviousBidAmount", "CustomerSalesRep", "BidID", "UpdateReason"]
      }
    ]
  },
  {
    id: "onboarding",
    name: "👨‍💼 Onboarding",
    description: "Carrier & employee onboarding, documentation, compliance verification",
    color: "bg-orange-600 text-white",
    templates: [
      // Carrier Onboarding
      {
        id: "15",
        name: "Carrier Onboarding Packet",
        subject: "Welcome {{CarrierName}} - Onboarding Started",
        category: "onboarding",
        description: "Welcome packet with required documents and next steps",
        status: "active" as const,
        lastModified: "1 week ago",
        variables: ["CarrierName", "ContactPerson", "AccountManager", "OnboardingLink", "RequiredDocuments", "CompanyName"]
      },
      {
        id: "16",
        name: "MC Verification Email",
        subject: "MC Authority Verification - {{CarrierName}} | {{MCNumber}}",
        category: "onboarding",
        description: "Motor carrier authority verification notification",
        status: "active" as const,
        lastModified: "3 days ago",
        variables: ["CarrierName", "MCNumber", "VerificationStatus", "ExpirationDate", "ComplianceManager", "AuthorityNumber"]
      },
      {
        id: "17",
        name: "Collaboration Invite",
        subject: "Invitation to Join {{CompanyName}} Network",
        category: "onboarding",
        description: "Invitation to join carrier collaboration platform",
        status: "active" as const,
        lastModified: "5 days ago",
        variables: ["CarrierName", "InvitationLink", "PlatformFeatures", "SupportContact", "AccountManager", "CompanyName"]
      },
      // Employee Onboarding
      {
        id: "18",
        name: "Account Created Notification",
        subject: "Welcome {{EmployeeName}} - Account Created",
        category: "onboarding",
        description: "New employee account creation confirmation",
        status: "active" as const,
        lastModified: "1 week ago",
        variables: ["EmployeeName", "Username", "TempPassword", "LoginURL", "HRManager", "Department", "CompanyName"]
      },
      {
        id: "19",
        name: "Email Invitation Link",
        subject: "Setup Your Account - {{EmployeeName}}",
        category: "onboarding",
        description: "Invitation link for new employee setup",
        status: "active" as const,
        lastModified: "4 days ago",
        variables: ["EmployeeName", "InvitationLink", "ExpirationDate", "HRManager", "CompanyName", "Department"]
      },
      {
        id: "20",
        name: "Email Confirmation Code",
        subject: "Verify Your Email - Code: {{ConfirmationCode}}",
        category: "onboarding",
        description: "Email verification code for account activation",
        status: "active" as const,
        lastModified: "6 days ago",
        variables: ["EmployeeName", "ConfirmationCode", "ExpirationTime", "SupportEmail", "SecurityNotice", "CompanyName"]
      },
      {
        id: "21",
        name: "IFTA Standalone Invite",
        subject: "IFTA Compliance Setup - {{DriverName}}",
        category: "onboarding",
        description: "Invitation to IFTA compliance system",
        status: "active" as const,
        lastModified: "1 week ago",
        variables: ["DriverName", "IFTAAccountID", "LoginCredentials", "ComplianceDeadline", "ComplianceManager", "CarrierName"]
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

  const handleToggleStatus = (id: string) => {
    console.log("Toggle status for template:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete template:", id);
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
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDelete}
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