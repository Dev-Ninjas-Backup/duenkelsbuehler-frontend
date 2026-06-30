export type SubStep =
  | "search"
  | "proposal-details"
  | "final-remarks"
  | "ready"
  | "track";

export interface SP {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
}

export interface ProposalData {
  sp: SP | null;
  title: string;
  serviceDescription: string;
  issueDate: string;
  dueDate: string;
  price: string;
  currency: string;
  paymentMethod: "TRUST_APP" | "BANK_TRANSFER" | "CARD";
  notes: string;
  terms: string;
  confirmSP: boolean;
  confirmUnverified: boolean;
}
