import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { EmailTemplate } from "@/types/templates";
import { X, Paperclip } from "lucide-react";

interface EmailPreviewModalProps {
  template: EmailTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmailPreviewModal({ template, isOpen, onClose }: EmailPreviewModalProps) {
  if (!template) return null;

  // Sample data for preview
  const sampleData = {
    LoadID: "LD-12345",
    LoadStatus: "Dispatched", 
    CarrierName: "ABC Trucking LLC",
    DriverName: "John Doe",
    PickupLocation: "Los Angeles, CA",
    DeliveryLocation: "Phoenix, AZ",
    StatementPeriod: "Week of March 1-7, 2024",
    TotalEarnings: "$3,250.00",
    BidAmount: "$2,100.00",
    ContactPerson: "Mike Johnson"
  };

  // Replace variables with sample data
  const renderWithVariables = (text: string) => {
    return text.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
      return sampleData[variable as keyof typeof sampleData] || match;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-primary border-tint">
        <DialogHeader className="pb-4 border-b border-tint">
          <DialogTitle className="text-header font-h4 text-left">
            Email Preview: {template.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Email Header Info */}
          <div className="bg-secondary rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-caption font-body3 text-sm">Subject:</span>
                <p className="text-body font-body2 mt-1">{renderWithVariables(template.subject)}</p>
              </div>
              <div>
                <span className="text-caption font-body3 text-sm">From:</span>
                <p className="text-body font-body3 mt-1">{template.fromAddress || "dispatch@company.com"}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-caption font-body3 text-sm">To:</span>
                <p className="text-body font-body3 mt-1">carrier@abctrucking.com</p>
              </div>
              {template.replyTo && (
                <div>
                  <span className="text-caption font-body3 text-sm">Reply-To:</span>
                  <p className="text-body font-body3 mt-1">{template.replyTo}</p>
                </div>
              )}
            </div>

            {template.ccAddresses && template.ccAddresses.length > 0 && (
              <div>
                <span className="text-caption font-body3 text-sm">CC:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {template.ccAddresses.map((email, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {renderWithVariables(email)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {template.bccAddresses && template.bccAddresses.length > 0 && (
              <div>
                <span className="text-caption font-body3 text-sm">BCC:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {template.bccAddresses.map((email, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {renderWithVariables(email)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {template.attachedDocuments && template.attachedDocuments.length > 0 && (
              <div>
                <span className="text-caption font-body3 text-sm">Attachments:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {template.attachedDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs text-body bg-tertiary px-2 py-1 rounded">
                      <Paperclip className="h-3 w-3" />
                      {doc}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Email Body */}
          <div className="bg-white border border-tint rounded-lg p-6 min-h-[400px]">
            <div 
              className="prose prose-sm max-w-none text-gray-900"
              dangerouslySetInnerHTML={{ 
                __html: renderWithVariables(template.body).replace(/\n/g, '<br/>') 
              }} 
            />
            
            {/* Email Signature */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="text-gray-600 text-sm">
                <p className="font-medium">Best regards,</p>
                <p>Dispatch Team</p>
                <p>ABC Logistics Company</p>
                <p>Phone: (555) 123-4567</p>
                <p>Email: dispatch@company.com</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}