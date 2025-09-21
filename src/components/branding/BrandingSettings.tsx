import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Upload, Globe, Shield, Plus, X } from "lucide-react";
import { useState } from "react";

export function BrandingSettings() {
  const [domains, setDomains] = useState([
    { id: 1, domain: "mail.yourcompany.com", status: "verified" as const },
    { id: 2, domain: "notifications.yourcompany.com", status: "pending" as const }
  ]);
  const [newDomain, setNewDomain] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [showDnsVerification, setShowDnsVerification] = useState(false);
  const [companyName, setCompanyName] = useState("Your Logistics Company");
  const [logoUrl, setLogoUrl] = useState("");
  const [signature, setSignature] = useState("");

  const dnsRecords = [
    {
      type: "SPF",
      name: "@",
      value: "v=spf1 include:sendgrid.net ~all",
      status: "verified" as const
    },
    {
      type: "DKIM",
      name: "s1._domainkey",
      value: "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...",
      status: "verified" as const
    },
    {
      type: "DMARC",
      name: "_dmarc",
      value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourcompany.com",
      status: "pending" as const
    }
  ];

  const statusIcons = {
    verified: <CheckCircle className="w-4 h-4 text-success" />,
    pending: <AlertCircle className="w-4 h-4 text-warning" />,
    failed: <AlertCircle className="w-4 h-4 text-destructive" />
  };

  const statusColors = {
    verified: "bg-success-light text-success border-success/20",
    pending: "bg-warning-light text-warning border-warning/20",
    failed: "bg-destructive/10 text-destructive border-destructive/20"
  };

  const addDomain = () => {
    if (newDomain && newDomain.includes('.')) {
      setDomains(prev => [...prev, {
        id: Date.now(),
        domain: newDomain,
        status: "pending" as const
      }]);
      setNewDomain("");
    }
  };

  const removeDomain = (id: number) => {
    setDomains(prev => prev.filter(d => d.id !== id));
  };

  const handleVerifyDomain = (domainId: number) => {
    setSelectedDomain(domainId);
    setShowDnsVerification(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Domain & Branding</h2>
        <p className="text-muted-foreground">Configure your domain settings and brand identity</p>
      </div>

      <div className="space-y-6">
        {/* Custom Domains */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Custom Domains
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Domain */}
            <div className="flex gap-2">
              <Input
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="mail.yourcompany.com"
                className="flex-1"
              />
              <Button onClick={addDomain} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Domain
              </Button>
            </div>

            {/* Domain List */}
            <div className="space-y-3">
              {domains.map((domain) => (
                <div key={domain.id} className="flex items-center justify-between p-3 border rounded-lg bg-gradient-card">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {statusIcons[domain.status]}
                      <span className="font-medium">{domain.domain}</span>
                    </div>
                    <Badge className={statusColors[domain.status]}>
                      {domain.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleVerifyDomain(domain.id)}
                    >
                      Verify
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => removeDomain(domain.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DNS Verification Modal/Panel */}
        {showDnsVerification && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                DNS Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add these DNS records to your domain to enable authenticated email delivery.
              </p>

              <div className="space-y-3">
                {dnsRecords.map((record, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-gradient-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{record.type}</span>
                        {statusIcons[record.status]}
                      </div>
                      <Badge className={statusColors[record.status]}>
                        {record.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex">
                        <span className="text-muted-foreground w-12">Name:</span>
                        <code className="bg-muted px-1 rounded">{record.name}</code>
                      </div>
                      <div className="flex">
                        <span className="text-muted-foreground w-12">Value:</span>
                        <code className="bg-muted px-1 rounded text-xs break-all">
                          {record.value.length > 40 ? record.value.substring(0, 40) + "..." : record.value}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowDnsVerification(false)}>
                  Close
                </Button>
                <Button className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify DNS Records
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
    </div>
  );
}