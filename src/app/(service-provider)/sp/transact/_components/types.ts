export type Tab = "new" | "track";

export type SubStep =
  | "client-search"
  | "contract"
  | "confirm"
  | "proposal-details"
  | "final-remarks"
  | "ready";

export interface Client {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  verified: boolean;
  trustapUserId?: string | null;
}

export interface SPProposalData {
  client: Client | null;
  contractFile: File | null;
  docuSign: boolean;
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
  avatar: string | null;
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
