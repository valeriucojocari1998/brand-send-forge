import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, Eye, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

const sampleTemplates = [
  {
    id: "load-released",
    name: "Load Released",
    category: "Operational",
    subject: "Load {{LoadID}} Released - Ready for Pickup"
  },
  {
    id: "detention",
    name: "Detention Notice",
    category: "Financial",
    subject: "Detention Charges Applied - Load {{LoadID}}"
  },
  {
    id: "paystub",
    name: "Paystub Available",
    category: "HR",
    subject: "Your Paystub is Ready - {{PayPeriod}}"
  }
];

const testHistory = [
  {
    id: "1",
    template: "Load Released",
    recipient: "test@yourcompany.com",
    timestamp: "2 minutes ago",
    status: "delivered" as const,
    subject: "Load LD12345 Released - Ready for Pickup"
  },
  {
    id: "2",
    template: "Detention Notice",
    recipient: "test@yourcompany.com",
    timestamp: "15 minutes ago",
    status: "delivered" as const,
    subject: "Detention Charges Applied - Load LD12344"
  },
  {
    id: "3",
    template: "Paystub Available",
    recipient: "test@yourcompany.com",
    timestamp: "1 hour ago",
    status: "pending" as const,
    subject: "Your Paystub is Ready - March 2024"
  }
];

const statusConfig = {
  delivered: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: "bg-success-light text-success border-success/20",
    label: "Delivered"
  },
  pending: {
    icon: <Clock className="w-4 h-4" />,
    color: "bg-warning-light text-warning border-warning/20",
    label: "Pending"
  },
  failed: {
    icon: <AlertCircle className="w-4 h-4" />,
    color: "bg-destructive/10 text-destructive border-destructive/20",
    label: "Failed"
  }
};

export function TestingPanel() {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [testEmail, setTestEmail] = useState("test@yourcompany.com");
  const [testData, setTestData] = useState(`{
  "LoadID": "LD12345",
  "CustomerName": "ABC Logistics",
  "DriverName": "John Smith",
  "PickupDate": "2024-03-20",
  "DeliveryDate": "2024-03-22",
  "Amount": "$150.00",
  "PayPeriod": "March 2024"
}`);

  const handleSendTest = () => {
    console.log("Sending test email...", {
      template: selectedTemplate,
      email: testEmail,
      data: testData
    });
  };

  const handlePreview = () => {
    console.log("Opening preview...", { template: selectedTemplate, data: testData });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Test & Preview</h2>
        <p className="text-muted-foreground">Test your email templates with real data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send Test Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template">Select Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template to test" />
                </SelectTrigger>
                <SelectContent>
                  {sampleTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        {template.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testEmail">Test Email Address</Label>
              <Input
                id="testEmail"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@yourcompany.com"
                type="email"
              />
              <p className="text-xs text-muted-foreground">
                Tests always send to the logged-in user's email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testData">Sample Data (JSON)</Label>
              <Textarea
                id="testData"
                value={testData}
                onChange={(e) => setTestData(e.target.value)}
                rows={8}
                className="font-mono text-sm"
                placeholder="Enter sample data for template variables"
              />
              <p className="text-xs text-muted-foreground">
                Provide sample values for template variables like LoadID, CustomerName, etc.
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handlePreview} 
                variant="outline" 
                className="flex-1"
                disabled={!selectedTemplate}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={handleSendTest} 
                className="flex-1 bg-gradient-primary hover:bg-primary-hover"
                disabled={!selectedTemplate || !testEmail}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Test
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Area */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Email Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTemplate ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-gradient-card">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">From:</span>
                      <span>notifications@yourcompany.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">To:</span>
                      <span>{testEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Subject:</span>
                      <span className="font-medium">
                        {sampleTemplates.find(t => t.id === selectedTemplate)?.subject || ""}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="space-y-3 text-sm">
                      <p>Dear Recipient,</p>
                      <p>
                        This is a preview of your email template with the provided sample data.
                        The actual email will render with real variable values.
                      </p>
                      
                      {selectedTemplate === "load-released" && (
                        <div className="bg-primary-light p-3 rounded">
                          <p className="font-medium">Load LD12345 has been released and is ready for pickup.</p>
                          <p className="mt-2">
                            <strong>Customer:</strong> ABC Logistics<br />
                            <strong>Pickup Date:</strong> March 20, 2024<br />
                            <strong>Delivery Date:</strong> March 22, 2024
                          </p>
                        </div>
                      )}
                      
                      {selectedTemplate === "detention" && (
                        <div className="bg-warning-light p-3 rounded">
                          <p className="font-medium">Detention charges have been applied to Load LD12345.</p>
                          <p className="mt-2">
                            <strong>Amount:</strong> $150.00<br />
                            <strong>Customer:</strong> ABC Logistics
                          </p>
                        </div>
                      )}
                      
                      {selectedTemplate === "paystub" && (
                        <div className="bg-accent-light p-3 rounded">
                          <p className="font-medium">Your paystub for March 2024 is now available.</p>
                          <p className="mt-2">Please log in to the portal to view your paystub.</p>
                        </div>
                      )}
                      
                      <p>
                        Best regards,<br />
                        Your Logistics Team<br />
                        Phone: (555) 123-4567<br />
                        Email: support@yourcompany.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a template to see the preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test History */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Test History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {testHistory.map((test) => {
              const status = statusConfig[test.status];
              return (
                <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg bg-gradient-card">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {status.icon}
                      <Badge className={status.color}>
                        {status.label}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{test.template}</p>
                      <p className="text-xs text-muted-foreground">{test.subject}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-muted-foreground">{test.recipient}</p>
                    <p className="text-xs text-muted-foreground">{test.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {testHistory.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No test emails sent yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}