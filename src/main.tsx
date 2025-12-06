import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { NewsProvider } from "./contexts/NewsContext.tsx";
import { TeachersProvider } from "./contexts/TeachersContext.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AuthProvider>
                <NewsProvider>
                    <TeachersProvider>
                        <App />
                    </TeachersProvider>
                </NewsProvider>
            </AuthProvider>
        </ThemeProvider>
    </BrowserRouter>
);