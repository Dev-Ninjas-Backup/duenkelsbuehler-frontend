export type SubStep =
  | "search"
  | "select-services"
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
  selectedServiceItemIds: number[];
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
