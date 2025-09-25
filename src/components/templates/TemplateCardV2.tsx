import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmailTemplate } from "@/types/templates";
import { Clock, MoreVertical, Copy, Edit, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateCardV2Props {
  template: EmailTemplate;
  onEdit: (template: EmailTemplate) => void;
  onDuplicate: (template: EmailTemplate) => void;
  onDelete: (template: EmailTemplate) => void;
  onPreview: (template: EmailTemplate) => void;
  onTest: (template: EmailTemplate) => void;
  onToggleStatus?: (template: EmailTemplate) => void;
}

const categoryIcons = {
  operational: "🚛",
  financial: "💰", 
  marketplace: "🏪",
  onboarding: "👨‍💼"
};

const categoryColors = {
  operational: "bg-blue-100 text-blue-800 border-blue-200",
  financial: "bg-green-100 text-green-800 border-green-200",
  marketplace: "bg-purple-100 text-purple-800 border-purple-200",
  onboarding: "bg-yellow-100 text-yellow-800 border-yellow-200"
};

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
  disabled: "bg-gray-100 text-gray-600 border-gray-200"
};

export function TemplateCardV2({ 
  template, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  onPreview, 
  onTest, 
  onToggleStatus 
}: TemplateCardV2Props) {
  const categoryIcon = categoryIcons[template.category];
  
  // Extract variables from subject and body
  const extractVariables = (text: string) => {
    const matches = text.match(/\{\{[^}]+\}\}/g) || [];
    return [...new Set(matches)];
  };
  
  const variables = [
    ...extractVariables(template.subject),
    ...extractVariables(template.body)
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="bg-primary border-tint hover:border-selected transition-colors">
      <CardHeader className="pb-3">
        {/* First Row: Category, Status, Actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn("text-xs font-medium border", categoryColors[template.category])}
            >
              <span className="mr-1">{categoryIcon}</span>
              {template.category}
            </Badge>
            <Badge 
              variant="outline"
              className={cn("text-xs font-medium border", statusColors[template.status])}
            >
              {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-caption hover:text-body"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-primary border-tint">
              <DropdownMenuItem onClick={() => onEdit(template)} className="text-sm text-body font-body3">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(template)} className="text-sm text-body font-body3">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPreview(template)} className="text-sm text-body font-body3">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(template)}
                className="text-sm text-destructive focus:text-destructive font-body3"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Second Row: Template Title (Bold) */}
        <div className="mb-3">
          <h3 className="text-header font-bold leading-tight mb-2">
            {template.name}
          </h3>
          {/* Subject Line (Regular Weight) */}
          <p className="text-body font-body3 leading-relaxed text-sm">
            {template.subject}
          </p>
        </div>
        
        {/* Description */}
        {template.description && (
          <p className="text-caption font-body3 leading-relaxed text-sm mb-3">
            {template.description}
          </p>
        )}
      </CardHeader>
      
      
      <CardFooter className="pt-0 pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1 text-caption">
            <Clock className="h-3 w-3" />
            <span className="text-xs">{formatDate(template.lastModified)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPreview(template)}
              className="h-8 w-8 text-caption hover:text-body hover:bg-hover"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(template)}
              className="h-8 w-8 text-caption hover:text-emphasis hover:bg-hover"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}