import { create } from "zustand";
import { SP, SubStep, ProposalData } from "@/app/(client)/client/transact/_components/types";

const EMPTY_DATA: ProposalData = {
  sp: null,
  selectedServiceItemIds: [],
  title: "",
  serviceDescription: "",
  issueDate: "",
  dueDate: "",
  price: "",
  currency: "USD",
  paymentMethod: "CARD",
  notes: "",
  terms: "",
  confirmSP: false,
  confirmUnverified: false,
};

interface TransactState {
  step: SubStep | null;
  data: ProposalData;
  setStep: (step: SubStep | null) => void;
  updateData: (data: Partial<ProposalData>) => void;
  resetTransact: () => void;
}

export const useTransactStore = create<TransactState>((set) => ({
  step: null,
  data: EMPTY_DATA,
  setStep: (step) => set({ step }),
  updateData: (updates) =>
    set((state) => ({ data: { ...state.data, ...updates } })),
  resetTransact: () => set({ step: null, data: EMPTY_DATA }),
}));
