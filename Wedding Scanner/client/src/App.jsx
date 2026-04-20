import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import UploadPage from "./pages/UploadPage";
import QrCodesPage from "./pages/QrCodesPage";
import ScannerPage from "./pages/ScannerPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<UploadPage />} />
        <Route path="/qrcodes" element={<QrCodesPage />} />
        <Route path="/scanner" element={<ScannerPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
