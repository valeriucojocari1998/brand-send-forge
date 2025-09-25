import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { VariableTooltip } from "@/components/ui/variable-tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Save, Send, Eye, Copy, Settings, Plus, X, Paperclip, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateEditorProps {
  templateId?: string;
  onBack: () => void;
  onSave: (template: any) => void;
}

// Variable categories by template category
const getCategoryVariables = (category: string) => {
  const allVariables = {
    load: ["LoadID", "LoadWeight", "PickupLocation", "DeliveryLocation", "PickupDate", "DeliveryDate", "SpecialInstructions", "LoadStatus", "PreviousStatus", "OrderNumber", "PONumber", "TotalBillable", "CarrierTotalPayable", "SalesManager", "AccountManager", "CustomerServiceRep", "Dispatcher", "TripNumber"],
    statuses: ["Dispatched", "Cancelled", "Released", "InTransit", "Delivered", "Invoiced", "Completed", "Paid"],
    carrier: ["CarrierName", "CarrierEmail", "CarrierMC", "DriverName", "DriverEmails"],
    customer: ["Customer/Broker3PL"],
    financial: ["InvoiceId", "PaymentTerms", "InvoiceDueDate"],
    user: ["User Name", "User Email"]
  };

  switch (category) {
    case "operational":
      return {
        load: allVariables.load.filter(v => v !== "TripNumber"),
        statuses: allVariables.statuses.filter(v => v !== "Paid"),
        carrier: allVariables.carrier,
        customer: allVariables.customer
      };
    case "financial":
      return {
        load: allVariables.load.filter(v => !["PreviousStatus", "TripNumber"].includes(v)),
        statuses: ["Released", "Delivered", "Invoiced", "Completed", "Paid"],
        carrier: allVariables.carrier,
        customer: allVariables.customer,
        financial: allVariables.financial
      };
    case "marketplace":
      return {
        load: ["LoadWeight", "PickupDate", "DeliveryDate", "TripNumber"]
      };
    case "onboarding":
      return {
        carrier: ["CarrierName", "CarrierEmail", "CarrierMC"],
        user: allVariables.user
      };
    default:
      return allVariables;
  }
};

const variableDescriptions: Record<string, { name: string; description: string; example: string }> = {
  LoadID: { name: "Load ID", description: "The unique load identifier", example: "LD-12345" },
  OrderNumber: { name: "Order Number", description: "The unique customer order reference", example: "SO-12345" },
  PONumber: { name: "PO Number", description: "Customer purchase order number", example: "PO-98765" },
  TotalBillable: { name: "Total Billable", description: "Total amount charged to customer", example: "$2,450.00" },
  CarrierTotalPayable: { name: "Carrier Total Payable", description: "Total amount paid to carrier", example: "$2,100.00" },
  SalesManager: { name: "Sales Manager", description: "Sales manager name and contact", example: "John Smith" },
  AccountManager: { name: "Account Manager", description: "Account manager for this customer", example: "Jane Doe" },
  CustomerServiceRep: { name: "Customer Service Rep", description: "Assigned customer service representative", example: "Mike Johnson" },
  Dispatcher: { name: "Dispatcher", description: "Load dispatcher name and contact", example: "Sarah Wilson" },
  CarrierName: { name: "Carrier Name", description: "The carrier company name", example: "ABC Trucking LLC" },
  CarrierEmail: { name: "Carrier Email", description: "Primary carrier contact email", example: "dispatch@abctrucking.com" },
  DriverEmails: { name: "Driver Emails", description: "Driver contact email addresses", example: "driver@abctrucking.com" },
  InvoiceId: { name: "Invoice ID", description: "Unique invoice identifier", example: "INV-12345" },
  PaymentTerms: { name: "Payment Terms", description: "Payment terms for invoice", example: "Net 30" },
  InvoiceDueDate: { name: "Invoice Due Date", description: "Payment due date", example: "2024-03-15" }
};

export function TemplateEditor({ templateId, onBack, onSave }: TemplateEditorProps) {
  const [template, setTemplate] = useState({
    name: templateId ? "Load Released Notification" : "",
    subject: templateId ? "Load {{LoadID}} Released - Ready for Pickup from {{PickupLocation}}" : "",
    category: "operational",
    description: templateId ? "Automated notification when load is released and ready for carrier pickup" : "",
    fromAddress: "dispatch@company.com",
    replyTo: templateId ? "{{CarrierEmail}}" : "",
    ccAddresses: templateId ? ["operations@company.com"] : [],
    bccAddresses: [],
    emailBody: templateId ? `Dear {{CarrierName}},

Load **{{LoadID}}** has been released and is ready for pickup.

### Load Details
- **Pickup:** {{PickupLocation}} on {{PickupDate}}
- **Delivery:** {{DeliveryLocation}} on {{DeliveryDate}}
- **Weight:** {{LoadWeight}} lbs

Please confirm receipt and provide your ETA for pickup.

Questions? Contact us or reply to this email.

Best regards,  
Dispatch Team` : "",
    attachedDocuments: [],
    variables: ["LoadID", "CarrierName", "PickupLocation", "DeliveryLocation", "PickupDate", "DeliveryDate", "LoadWeight", "SpecialInstructions"]
  });

  const [activeTab, setActiveTab] = useState("content");
  const [newCcEmail, setNewCcEmail] = useState("");
  const [newBccEmail, setNewBccEmail] = useState("");
  const [showTestDialog, setShowTestDialog] = useState(false);

  const addEmailAddress = (type: 'cc' | 'bcc', email: string) => {
    if (email && email.includes('@')) {
      setTemplate(prev => ({
        ...prev,
        [`${type}Addresses`]: [...prev[`${type}Addresses` as keyof typeof prev] as string[], email]
      }));
      if (type === 'cc') setNewCcEmail("");
      else setNewBccEmail("");
    }
  };

  const removeEmailAddress = (type: 'cc' | 'bcc', index: number) => {
    setTemplate(prev => ({
      ...prev,
      [`${type}Addresses`]: (prev[`${type}Addresses` as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const insertVariable = (variable: string, targetField: 'subject' | 'emailBody') => {
    const variableTag = `{{${variable}}}`;
    setTemplate(prev => ({
      ...prev,
      [targetField]: prev[targetField] + variableTag
    }));
  };

  const handleTest = () => {
    setShowTestDialog(true);
  };

  const handleConfirmTest = () => {
    console.log("Send test email");
    setShowTestDialog(false);
  };

  // Check if variables are present in email fields
  const hasVariablesInEmails = () => {
    const allEmails = [template.replyTo, ...template.ccAddresses, ...template.bccAddresses].join(' ');
    return /\{\{.*?\}\}/.test(allEmails);
  };

  const handleSave = () => {
    onSave(template);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{templateId ? 'Edit' : 'Create'} Template</h2>
            <p className="text-muted-foreground">Configure email template content and settings</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="outline" className="text-success border-success hover:bg-success-light">
            <Badge className="w-4 h-4 mr-2" />
            Activate Template
          </Button>
          <Button onClick={handleTest} className="bg-gradient-primary hover:bg-primary-hover">
            <Send className="w-4 h-4 mr-2" />
            Test Send
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Template Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-1">
                    Template Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={template.name}
                    onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Load Release Notification"
                    className={!template.name ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="flex items-center gap-1">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={template.category} onValueChange={(value) => setTemplate(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">🚛 Operational Workflows</SelectItem>
                      <SelectItem value="financial">💰 Financial & Settlements</SelectItem>
                      <SelectItem value="marketplace">🏪 Marketplace</SelectItem>
                      <SelectItem value="onboarding">👨‍💼 Onboarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subject Line */}
              <div>
                <Label htmlFor="subject" className="flex items-center gap-1">
                  Subject Line <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  value={template.subject}
                  onChange={(e) => setTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g., Load {{LoadID}} - Status Update"
                  className={!template.subject ? "border-red-500" : ""}
                />
                {!template.subject && (
                  <p className="text-xs text-red-500 mt-1">Subject line is required</p>
                )}
              </div>

              {/* Template Description */}
              <div>
                <Label htmlFor="description" className="flex items-center gap-1">
                  Template Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={template.description}
                  onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  placeholder="Brief description of when and why this template is used"
                  className={!template.description ? "border-red-500" : ""}
                />
                {!template.description && (
                  <p className="text-xs text-red-500 mt-1">Template description is required</p>
                )}
              </div>

              {/* Email Body */}
              <div>
                <Label htmlFor="emailBody" className="flex items-center gap-1">
                  Email Body <span className="text-red-500">*</span>
                </Label>
                <RichTextEditor
                  content={template.emailBody}
                  onChange={(content) => setTemplate(prev => ({ ...prev, emailBody: content }))}
                  placeholder="Write your email content here. Use {{variables}} to insert dynamic data..."
                />
                {!template.emailBody && (
                  <p className="text-xs text-red-500 mt-1">Email body is required</p>
                )}
              </div>

              {/* Email Routing Configuration */}
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Email Routing Configuration</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fromAddress" className="flex items-center gap-1">
                        From Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fromAddress"
                        value={template.fromAddress}
                        disabled
                        className="bg-muted text-muted-foreground"
                        placeholder="Will use details from Brand Assets"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Automatically configured from Brand Assets settings</p>
                    </div>
                     <div>
                       <Label htmlFor="replyTo" className="flex items-center gap-1">
                         To: <span className="text-red-500">*</span>
                       </Label>
                       <Input
                         id="replyTo"
                         value={template.replyTo}
                         onChange={(e) => setTemplate(prev => ({ ...prev, replyTo: e.target.value }))}
                         placeholder="{{CarrierEmail}} or recipient@company.com"
                         className={!template.replyTo ? "border-red-500" : ""}
                       />
                       {!template.replyTo && (
                         <p className="text-xs text-red-500 mt-1">To address is required</p>
                       )}
                     </div>
                  </div>

                  <div>
                    <Label>CC Recipients</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newCcEmail}
                        onChange={(e) => setNewCcEmail(e.target.value)}
                        placeholder="Optional: {{CarrierEmail}} or email@company.com"
                        onKeyPress={(e) => e.key === 'Enter' && addEmailAddress('cc', newCcEmail)}
                      />
                      <Button size="sm" onClick={() => addEmailAddress('cc', newCcEmail)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {template.ccAddresses.map((email, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {email}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeEmailAddress('cc', index)}
                          />
                        </Badge>
                      ))}
                    </div>
                    {template.ccAddresses.some(email => /\{\{.*?\}\}/.test(email)) && (
                      <div className="flex items-start gap-2 mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800">
                        <AlertTriangle className="w-4 h-4 mt-0.5 text-orange-600" />
                        <span>Variables in CC may be empty during sending. Email might fail if all CC addresses are empty.</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>BCC Recipients</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newBccEmail}
                        onChange={(e) => setNewBccEmail(e.target.value)}
                        placeholder="Optional: {{AccountManagerEmail}} or email@company.com"
                        onKeyPress={(e) => e.key === 'Enter' && addEmailAddress('bcc', newBccEmail)}
                      />
                      <Button size="sm" onClick={() => addEmailAddress('bcc', newBccEmail)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {template.bccAddresses.map((email, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {email}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeEmailAddress('bcc', index)}
                          />
                        </Badge>
                      ))}
                    </div>
                    {template.bccAddresses.some(email => /\{\{.*?\}\}/.test(email)) && (
                      <div className="flex items-start gap-2 mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800">
                        <AlertTriangle className="w-4 h-4 mt-0.5 text-orange-600" />
                        <span>Variables in BCC may be empty during sending. Email might fail if all BCC addresses are empty.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Attached Documents */}
              <Separator />
              <div>
                <Label>Attached Documents</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Paperclip className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Drag and drop documents or click to browse</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Add Documents
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Variables Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Available Variables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(getCategoryVariables(template.category)).map(([category, variables]) => (
                <div key={category}>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">{category}</h4>
                  <div className="space-y-1">
                    {variables.map((variable) => (
                      <VariableTooltip 
                        key={variable}
                        variable={variable}
                      >
                        <button
                          onClick={() => insertVariable(variable, 'emailBody')}
                          className={cn(
                            "w-full text-left px-2 py-1 text-xs rounded transition-colors duration-200 cursor-pointer",
                            "hover:bg-orange-100 hover:text-orange-800 border border-transparent hover:border-orange-300"
                          )}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', `{{${variable}}}`);
                          }}
                        >
                          {`{{${variable}}}`}
                        </button>
                      </VariableTooltip>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Test Send Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
            <DialogDescription>
              This test email will be sent <strong>only to your current user account</strong>, ignoring the default Email Routing settings. 
              The email will use mock/sample data to replace all template variables.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
              <div className="font-medium mb-1">Test Details:</div>
              <ul className="space-y-1 text-xs">
                <li>• Email will be sent to your logged-in user email only</li>
                <li>• All variables will be replaced with realistic sample data</li>
                <li>• Email routing rules will be bypassed for this test</li>
                <li>• This helps you verify template formatting and content</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmTest}>
              Send Test Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}