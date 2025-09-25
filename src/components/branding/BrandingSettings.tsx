import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Upload, Mail, Truck, DollarSign, Store, Users } from "lucide-react";
import { useState } from "react";

type CategoryType = "operational" | "financial" | "marketplace" | "onboarding";

interface CategoryConfig {
  id: CategoryType;
  name: string;
  icon: React.ReactNode;
  defaultTo: string;
  fromAddress: "default" | "custom";
  customFrom?: string;
  customDomain?: string;
  toAddress?: string;
}

export function BrandingSettings() {
  const [companyName, setCompanyName] = useState("Your Logistics Company");
  const [logoUrl, setLogoUrl] = useState("");
  const [signature, setSignature] = useState("");
  const [showCustomEmailDialog, setShowCustomEmailDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const [customEmailForm, setCustomEmailForm] = useState({ from: "", domain: "" });
  
  // Mock active domains - in real app this would come from domain settings
  const activeDomains = [
    "yourcompany.com",
    "dispatch.yourcompany.com",
    "accounting.yourcompany.com"
  ];

  const [categories, setCategories] = useState<CategoryConfig[]>([
    {
      id: "operational",
      name: "Operational",
      icon: <Truck className="w-4 h-4" />,
      defaultTo: "dispatch@company.com",
      fromAddress: "default",
      toAddress: "dispatch@company.com"
    },
    {
      id: "financial",
      name: "Financial",
      icon: <DollarSign className="w-4 h-4" />,
      defaultTo: "accounting@company.com",
      fromAddress: "default",
      toAddress: "accounting@company.com"
    },
    {
      id: "marketplace",
      name: "Marketplace",
      icon: <Store className="w-4 h-4" />,
      defaultTo: "bids@company.com",
      fromAddress: "default",
      toAddress: "bids@company.com"
    },
    {
      id: "onboarding",
      name: "Onboarding",
      icon: <Users className="w-4 h-4" />,
      defaultTo: "onboarding@company.com",
      fromAddress: "default",
      toAddress: "onboarding@company.com"
    }
  ]);

  const updateCategoryFromAddress = (categoryId: CategoryType, value: string) => {
    if (value === "custom") {
      // Check if there are active domains
      if (activeDomains.length === 0) {
        // Don't open dialog if no active domains
        return;
      }
      setEditingCategory(categoryId);
      setCustomEmailForm({ from: "", domain: activeDomains[0] });
      setShowCustomEmailDialog(true);
    } else {
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, fromAddress: "default" as const, customFrom: undefined, customDomain: undefined }
          : cat
      ));
    }
  };

  const updateCategoryToAddress = (categoryId: CategoryType, value: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, toAddress: value } : cat
    ));
  };

  const handleSaveCustomEmail = () => {
    if (editingCategory && customEmailForm.from && customEmailForm.domain) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory 
          ? { 
              ...cat, 
              fromAddress: "custom" as const, 
              customFrom: customEmailForm.from,
              customDomain: customEmailForm.domain
            }
          : cat
      ));
      setShowCustomEmailDialog(false);
      setEditingCategory(null);
      setCustomEmailForm({ from: "", domain: "" });
    }
  };

  const getCategoryFromDisplayValue = (category: CategoryConfig) => {
    if (category.fromAddress === "custom" && category.customFrom && category.customDomain) {
      return `${category.customFrom}@${category.customDomain}`;
    }
    return "Default (app@alvys.com)";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Brand Assets</h2>
        <p className="text-muted-foreground">Configure your brand identity and default email addresses</p>
      </div>

      <div className="space-y-6">
        {/* Default From Addresses per Category */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Default From Addresses per Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="grid grid-cols-3 gap-4 items-end p-4 border rounded-lg bg-gradient-card">
                  {/* Category Column */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Category</Label>
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </div>

                  {/* From Column */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      From <span className="text-destructive">*</span>
                    </Label>
                    <Select 
                      value={category.fromAddress} 
                      onValueChange={(value) => updateCategoryFromAddress(category.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {getCategoryFromDisplayValue(category)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default (app@alvys.com)</SelectItem>
                        <SelectItem value="custom">Custom Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* To Column */}
                  <div className="space-y-2">
                    <Label htmlFor={`to-${category.id}`} className="text-sm font-medium">To (optional)</Label>
                    <Input
                      id={`to-${category.id}`}
                      value={category.toAddress || ""}
                      onChange={(e) => updateCategoryToAddress(category.id, e.target.value)}
                      placeholder={category.defaultTo}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Brand Assets */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Brand Assets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your Logistics Company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl">Company Logo URL</Label>
              <Input
                id="logoUrl"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://yourcompany.com/logo.png"
              />
              <p className="text-xs text-muted-foreground">
                Recommended size: 200x60 pixels
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signature">Email Signature</Label>
              <Textarea
                id="signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Best regards,&#10;Your Logistics Team&#10;Phone: (555) 123-4567&#10;Email: support@yourcompany.com"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                This signature will be appended to all emails
              </p>
            </div>

            <Button className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Save Brand Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Custom Email Dialog */}
      <Dialog open={showCustomEmailDialog} onOpenChange={setShowCustomEmailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-from">
                To <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="custom-from"
                  value={customEmailForm.from}
                  onChange={(e) => setCustomEmailForm(prev => ({ ...prev, from: e.target.value }))}
                  placeholder="dispatch"
                />
                <span className="text-muted-foreground">@</span>
                <Select 
                  value={customEmailForm.domain} 
                  onValueChange={(value) => setCustomEmailForm(prev => ({ ...prev, domain: value }))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activeDomains.map((domain) => (
                      <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowCustomEmailDialog(false)}>
                CANCEL
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSaveCustomEmail}
                disabled={!customEmailForm.from || !customEmailForm.domain}
              >
                SAVE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}