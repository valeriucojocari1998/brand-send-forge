export type TemplateCategoryType = "operational" | "financial" | "marketplace" | "onboarding";

export type TemplateStatus = "active" | "draft" | "disabled";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: TemplateCategoryType;
  description?: string;
  status: TemplateStatus;
  lastModified: Date;
  variables: string[];
  fromAddress?: string;
  replyTo?: string;
  ccAddresses?: string[];
  bccAddresses?: string[];
  attachedDocuments?: string[];
}

export interface TemplateCategory {
  id: TemplateCategoryType;
  name: string;
  description: string;
  icon: string;
  color: string;
  templates: EmailTemplate[];
}