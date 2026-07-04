export type QuoteTemplateConfig = {
  id: string;
  name: string;
  category: string;
  thumbnail_url?: string;
};

export const QUOTE_TEMPLATES: QuoteTemplateConfig[] = [
  {
    id: 'modern',
    name: 'Modern Design',
    category: 'Minimal',
  },
  {
    id: 'classic',
    name: 'Classic Document',
    category: 'Minimal',
  },
  {
    id: 'purple_wave',
    name: 'Purple Wave',
    category: 'Bold/Wave',
  }
];
