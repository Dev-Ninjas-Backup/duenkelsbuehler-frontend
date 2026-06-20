import { ReactNode } from "react";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SmoothScrollProvider>
      <div>{children}</div>
    </SmoothScrollProvider>
  );
};

export default MainLayout;