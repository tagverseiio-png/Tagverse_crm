export type LineItem = {
  id: number;
  desc: string;
  qty: number;
  price: number;
};

export interface TemplateRendererProps {
  quoteId: string;
  docType: 'Quote' | 'Invoice';
  issued: string;
  expires: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  scope: string;
  items: LineItem[];
  currency: string;
  subtotal: number;
  discountRate: number;
  discountAmt: number;
  cgstRate: number;
  cgstAmt: number;
  sgstRate: number;
  sgstAmt: number;
  total: number;
  notes: string;
  terms: string;
  delivery: string;
  fmtDate: (s: string) => string;
}
