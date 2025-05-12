import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HeroUIProvider } from "@heroui/react";
import {ToastProvider} from "@heroui/toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
    <ToastProvider placement='top-right'/>
      <App />
    </HeroUIProvider>
  </StrictMode>
);
