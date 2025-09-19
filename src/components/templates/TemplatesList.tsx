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
    name: "Operational",
    description: "Dispatch, check-in/out, load releases",
    color: "bg-primary text-primary-foreground",
    templates: [
      {
        id: "1",
        name: "Load Released",
        subject: "Load {{LoadID}} Released - Ready for Pickup",
        category: "operational",
        description: "Notifies when a load is released and ready for pickup",
        status: "active" as const,
        lastModified: "2 hours ago",
        variables: ["LoadID", "CustomerName", "PickupDate", "DeliveryDate"]
      },
      {
        id: "2",
        name: "Check In/Out Notification",
        subject: "Driver {{DriverName}} - {{CheckType}} at {{Location}}",
        category: "operational",
        description: "Automatic notifications for driver check-ins and check-outs",
        status: "active" as const,
        lastModified: "1 day ago",
        variables: ["DriverName", "CheckType", "Location", "Timestamp"]
      },
      {
        id: "3",
        name: "Dispatch Alert",
        subject: "New Load Assignment - {{LoadID}}",
        category: "operational",
        description: "Alert for new load assignments to drivers",
        status: "draft" as const,
        lastModified: "3 days ago",
        variables: ["LoadID", "DriverName", "RouteDetails", "Priority"]
      }
    ]
  },
  {
    id: "financial",
    name: "Financial",
    description: "Detention, quick pay, accounting",
    color: "bg-accent text-accent-foreground",
    templates: [
      {
        id: "4",
        name: "Detention Notice",
        subject: "Detention Charges Applied - Load {{LoadID}}",
        category: "financial",
        description: "Notification when detention charges are applied",
        status: "active" as const,
        lastModified: "1 hour ago",
        variables: ["LoadID", "DetentionHours", "Amount", "CustomerName"]
      },
      {
        id: "5",
        name: "Quick Pay Confirmation",
        subject: "Quick Pay Processed - {{Amount}}",
        category: "financial",
        description: "Confirmation for quick pay transactions",
        status: "active" as const,
        lastModified: "5 hours ago",
        variables: ["Amount", "TransactionID", "LoadID", "ProcessedDate"]
      },
      {
        id: "6",
        name: "Accounting Update",
        subject: "Invoice {{InvoiceID}} - {{Status}}",
        category: "financial",
        description: "General accounting status updates",
        status: "disabled" as const,
        lastModified: "1 week ago",
        variables: ["InvoiceID", "Status", "Amount", "DueDate"]
      }
    ]
  },
  {
    id: "hr",
    name: "HR",
    description: "Paystubs and employee communications",
    color: "bg-warning text-warning-foreground",
    templates: [
      {
        id: "7",
        name: "Paystub Available",
        subject: "Your Paystub is Ready - {{PayPeriod}}",
        category: "hr",
        description: "Notification when paystubs are available",
        status: "active" as const,
        lastModified: "2 days ago",
        variables: ["PayPeriod", "EmployeeName", "GrossPay", "NetPay"]
      }
    ]
  },
  {
    id: "reporting",
    name: "Reporting",
    description: "Trip reports and analytics",
    color: "bg-secondary text-secondary-foreground",
    templates: [
      {
        id: "8",
        name: "Trip Report",
        subject: "Trip Report - {{TripID}} Completed",
        category: "reporting",
        description: "Automated trip completion reports",
        status: "active" as const,
        lastModified: "6 hours ago",
        variables: ["TripID", "Distance", "Duration", "FuelUsed", "DriverName"]
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