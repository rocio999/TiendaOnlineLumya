"use client";
import { CarritoProvider } from "./CarritoContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CarritoProvider>{children}</CarritoProvider>;
}