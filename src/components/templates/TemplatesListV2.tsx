import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TemplateCardV2 } from "./TemplateCardV2";
import { EmailTemplate, TemplateCategoryType } from "@/types/templates";
import { Search, Plus, Filter, ChevronDown } from "lucide-react";

interface TemplatesListV2Props {
  templates?: EmailTemplate[];
  onCreateTemplate: () => void;
  onEditTemplate: (template: EmailTemplate) => void;
}

const mockTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Load Status Change Notification",
    subject: "Load {{LoadID}} Status Updated: {{LoadStatus}}",
    body: "Dear {{CarrierName}}, the status of load {{LoadID}} has been updated to {{LoadStatus}}.",
    category: "operational",
    description: "Triggered when load status changes (Dispatched, Cancelled, Released, etc.)",
    status: "active",
    lastModified: new Date(Date.now() - 3600000),
    variables: ["LoadID", "LoadStatus", "PreviousStatus", "CarrierName"],
  },
  {
    id: "2",
    name: "Driver Statement Email",
    subject: "Driver Statement - {{StatementPeriod}} | {{DriverName}}",
    body: "Dear {{DriverName}}, your statement for {{StatementPeriod}} is ready.",
    category: "financial",
    description: "Weekly/monthly statement for driver payments and settlements",
    status: "active",
    lastModified: new Date(Date.now() - 7200000),
    variables: ["DriverName", "StatementPeriod", "TotalEarnings"],
  },
  {
    id: "3",
    name: "Marketplace Bid Received",
    subject: "New Bid Received - Load {{LoadID}} | ${{BidAmount}}",
    body: "A new bid has been received for load {{LoadID}} from {{CarrierName}}.",
    category: "marketplace",
    description: "Notification when a new bid is received on marketplace load",
    status: "draft",
    lastModified: new Date(Date.now() - 86400000),
    variables: ["LoadID", "CarrierName", "BidAmount"],
  },
  {
    id: "4",
    name: "Carrier Onboarding Packet",
    subject: "Welcome {{CarrierName}} - Onboarding Started",
    body: "Welcome to our network! Your onboarding process has begun.",
    category: "onboarding",
    description: "Welcome packet with required documents and next steps",
    status: "active",
    lastModified: new Date(Date.now() - 172800000),
    variables: ["CarrierName", "ContactPerson"],
  },
];

const categoryConfig = {
  operational: {
    name: "🚛 Operational",
    description: "Load status changes, driver notifications, delay alerts",
    color: "bg-blue-100 text-blue-700"
  },
  financial: {
    name: "💰 Financial",
    description: "Driver payments, carrier settlements, quick pay",
    color: "bg-green-100 text-green-700"
  },
  marketplace: {
    name: "🏪 Marketplace",
    description: "Bidding workflow, load postings, carrier communications",
    color: "bg-purple-100 text-purple-700"
  },
  onboarding: {
    name: "👨‍💼 Onboarding",
    description: "Carrier & employee onboarding, documentation",
    color: "bg-orange-100 text-orange-700"
  }
};

export function TemplatesListV2({ templates = mockTemplates, onCreateTemplate, onEditTemplate }: TemplatesListV2Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategoryType[]>(["operational", "financial", "marketplace", "onboarding"]);
  const [statusFilter, setStatusFilter] = useState<("active" | "draft" | "disabled")[]>(["active", "draft", "disabled"]);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter.includes(template.category);
    const matchesStatus = statusFilter.includes(template.status);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDuplicate = (template: EmailTemplate) => {
    console.log("Duplicate template:", template.id);
  };

  const handleDelete = (template: EmailTemplate) => {
    console.log("Delete template:", template.id);
  };

  const handlePreview = (template: EmailTemplate) => {
    console.log("Preview template:", template.id);
  };

  const handleTest = (template: EmailTemplate) => {
    console.log("Test template:", template.id);
  };

  const handleToggleStatus = (template: EmailTemplate) => {
    console.log("Toggle status for template:", template.id);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-header font-h2">Email Templates</h1>
          <p className="text-body font-body3 mt-1 sr-only">Manage your email templates and automation</p>
        </div>
        <Button onClick={onCreateTemplate} className="bg-emphasis hover:bg-emphasis/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Search and Filters Row */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-caption" />
          <Input
            placeholder="Search templates by name, subject or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-tint text-body"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-48 bg-secondary border-tint justify-between">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-caption" />
                <span className="text-body font-body3">
                  {categoryFilter.length === 4 ? "All Categories" : `${categoryFilter.length} Categories`}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-caption" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-primary border-tint z-50 w-56">
            <DropdownMenuCheckboxItem
              checked={categoryFilter.length === 4}
              onCheckedChange={(checked) => {
                setCategoryFilter(
                  checked ? ["operational", "financial", "marketplace", "onboarding"] : []
                );
              }}
              className="text-body font-body3"
            >
              All Categories
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={categoryFilter.includes("operational")}
              onCheckedChange={(checked) => {
                setCategoryFilter((prev) =>
                  checked ? Array.from(new Set([...prev, "operational"])) : prev.filter((c) => c !== "operational")
                );
              }}
              className="text-body font-body3"
            >
              🚛 Operational
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={categoryFilter.includes("financial")}
              onCheckedChange={(checked) => {
                setCategoryFilter((prev) =>
                  checked ? Array.from(new Set([...prev, "financial"])) : prev.filter((c) => c !== "financial")
                );
              }}
              className="text-body font-body3"
            >
              💰 Financial
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={categoryFilter.includes("marketplace")}
              onCheckedChange={(checked) => {
                setCategoryFilter((prev) =>
                  checked ? Array.from(new Set([...prev, "marketplace"])) : prev.filter((c) => c !== "marketplace")
                );
              }}
              className="text-body font-body3"
            >
              🏪 Marketplace
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={categoryFilter.includes("onboarding")}
              onCheckedChange={(checked) => {
                setCategoryFilter((prev) =>
                  checked ? Array.from(new Set([...prev, "onboarding"])) : prev.filter((c) => c !== "onboarding")
                );
              }}
              className="text-body font-body3"
            >
              👨‍💼 Onboarding
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-32 bg-secondary border-tint justify-between">
              <span className="text-body font-body3">
                {statusFilter.length === 3 ? "All Status" : `${statusFilter.length} Status`}
              </span>
              <ChevronDown className="h-4 w-4 text-caption" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-primary border-tint z-50 w-48">
            <DropdownMenuCheckboxItem
              checked={statusFilter.length === 3}
              onCheckedChange={(checked) => {
                setStatusFilter(checked ? ["active", "draft", "disabled"] : []);
              }}
              className="text-body font-body3"
            >
              All Status
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("active")}
              onCheckedChange={(checked) => {
                setStatusFilter((prev) =>
                  checked ? Array.from(new Set([...prev, "active"])) : prev.filter((s) => s !== "active")
                );
              }}
              className="text-body font-body3"
            >
              Active
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("draft")}
              onCheckedChange={(checked) => {
                setStatusFilter((prev) =>
                  checked ? Array.from(new Set([...prev, "draft"])) : prev.filter((s) => s !== "draft")
                );
              }}
              className="text-body font-body3"
            >
              Draft
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("disabled")}
              onCheckedChange={(checked) => {
                setStatusFilter((prev) =>
                  checked ? Array.from(new Set([...prev, "disabled"])) : prev.filter((s) => s !== "disabled")
                );
              }}
              className="text-body font-body3"
            >
              Disabled
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <div className="rounded-full bg-tertiary p-6 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Search className="h-8 w-8 text-caption" />
          </div>
          <h3 className="text-header font-h5 mb-2">No templates found</h3>
          <p className="text-body font-body3 mb-4">
            {searchQuery || categoryFilter.length < 4 || statusFilter.length < 3
              ? "Try adjusting your filters" 
              : "Get started by creating your first email template"
            }
          </p>
          {!searchQuery && categoryFilter.length === 4 && statusFilter.length === 3 && (
            <Button onClick={onCreateTemplate} className="bg-emphasis hover:bg-emphasis/90 text-white font-body3">
              <Plus className="h-4 w-4 mr-2" />
              Create First Template
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCardV2
              key={template.id}
              template={template}
              onEdit={onEditTemplate}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onPreview={handlePreview}
              onTest={handleTest}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}