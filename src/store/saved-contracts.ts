import { create } from "zustand";

export interface SavedContract {
  id: string;
  fileName: string;
  clientName: string;
  amount: string;
  invoiceTitle: string;
  savedAt: string;
  file?: File;
}

export interface SaveContractPayload {
  file: File;
  clientName: string;
  amount: string;
  invoiceTitle: string;
}

interface SavedContractsStore {
  contracts: SavedContract[];
  saveContract: (payload: SaveContractPayload) => void;
  removeContract: (id: string) => void;
}

const DUMMY_CONTRACTS: SavedContract[] = [
  { id: "1", fileName: "service-agreement-sophia.pdf",   clientName: "Sophia Hartwell",   amount: "$1,000 – $5,000",  invoiceTitle: "Brand Strategy Q1",      savedAt: "12 Jan 2025" },
  { id: "2", fileName: "consulting-contract-marcus.pdf", clientName: "Marcus Deleon",     amount: "$500 – $1,000",   invoiceTitle: "Social Media Audit",     savedAt: "28 Feb 2025" },
  { id: "3", fileName: "retainer-agreement-camille.pdf", clientName: "Camille Voss",      amount: "$5,000 – $10,000", invoiceTitle: "Monthly Retainer",      savedAt: "5 Mar 2025" },
  { id: "4", fileName: "project-scope-natalie.pdf",      clientName: "Natalie Cruz",      amount: "$2,500 – $5,000",  invoiceTitle: "Website Redesign",      savedAt: "19 Mar 2025" },
  { id: "5", fileName: "nda-jordan.pdf",                 clientName: "Jordan Ashby",      amount: "$250 – $500",     invoiceTitle: "NDA & Onboarding",      savedAt: "2 Apr 2025" },
  { id: "6", fileName: "freelance-contract-elijah.pdf",  clientName: "Elijah Monroe",     amount: "$1,500 – $3,000",  invoiceTitle: "Content Creation Pack", savedAt: "14 Apr 2025" },
];

export const useSavedContracts = create<SavedContractsStore>((set) => ({
  contracts: DUMMY_CONTRACTS,
  saveContract: ({ file, clientName, amount, invoiceTitle }) =>
    set((state) => ({
      contracts: [
        ...state.contracts,
        {
          id: Date.now().toString(),
          fileName: file.name,
          clientName,
          amount,
          invoiceTitle,
          savedAt: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          file,
        },
      ],
    })),
  removeContract: (id) =>
    set((state) => ({
      contracts: state.contracts.filter((c) => c.id !== id),
    })),
}));
