export type SubStep =
  | "search"
  | "contract"
  | "confirm"
  | "select-services"
  | "proposal-details"
  | "final-remarks"
  | "ready"
  | "track";

export interface SP {
  id: number;
  name: string;
  handle: string;
  avatar: string | null;
  verified: boolean;
}

export interface ProposalData {
  sp: SP | null;
  selectedServiceItemIds: number[];
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
  confirmSP: boolean;
  confirmUnverified: boolean;
}
