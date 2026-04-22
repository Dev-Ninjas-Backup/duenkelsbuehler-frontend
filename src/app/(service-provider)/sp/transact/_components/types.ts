export type Tab = "new" | "track";

export type SubStep =
  | "contacts"
  | "amount"
  | "payment-method"
  | "contract"
  | "invoice"
  | "final-details"
  | "ready";

export interface Contact {
  id: number;
  name: string;
  avatar: string;
  badge?: "gold" | "warning";
}

export interface TransactionData {
  contact: Contact | null;
  amountRange: string | null;
  paymentMethod: string | null;
  contractFile: File | null;
  docuSign: boolean;
  invoiceTitle: string;
  issueDate: string;
  dueDate: string;
  price: string;
  tax: string;
  notes: string;
  terms: string;
  confirmClient: boolean;
  confirmUnverified: boolean;
}
