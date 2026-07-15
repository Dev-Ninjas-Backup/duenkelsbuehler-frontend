export type Tab = "new" | "track";

export type SubStep =
  | "client-search"
  | "proposal-details"
  | "final-remarks"
  | "ready";

export interface Client {
  id: number;
  name: string;
  email: string;
  avatar: string;
  verified: boolean;
  trustapUserId?: string | null;
}

export interface SPProposalData {
  client: Client | null;
  title: string;
  serviceDescription: string;
  issueDate: string;
  dueDate: string;
  price: string;
  currency: string;
  paymentMethod: "TRUST_APP" | "BANK_TRANSFER" | "CARD";
  notes: string;
  terms: string;
  confirmClient: boolean;
  confirmUnverified: boolean;
}

export interface Contact {
  id: number;
  name: string;
  avatar: string;
  badge?: "gold" | "warning";
  trustapUserId?: string | null;
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
