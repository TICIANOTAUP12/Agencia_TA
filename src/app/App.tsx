import { BrowserRouter, Route, Routes } from "react-router";
import { DiagnosticoGraciasPage } from "./pages/DiagnosticoGraciasPage";
import { DiagnosticoPage } from "./pages/DiagnosticoPage";
import { PointOnceLanding } from "./pages/PointOnceLanding";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { PromoCanjePage } from "./pages/PromoCanjePage";
import { PromoErpPage } from "./pages/PromoErpPage";

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<PointOnceLanding />} />
        <Route path="/diagnostico" element={<DiagnosticoPage />} />
        <Route path="/diagnostico/gracias" element={<DiagnosticoGraciasPage />} />
        <Route path="/promo-canje" element={<PromoCanjePage />} />
        <Route path="/promo-erp" element={<PromoErpPage />} />
        <Route path="/politica-de-privacidad" element={<PrivacyPolicyPage />} />
      </Routes>
    </BrowserRouter>
  );
}
