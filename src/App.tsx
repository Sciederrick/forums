import { Route, Routes } from "react-router-dom";

import ChatPage from "./pages/Chat";
import NotFound from "./pages/NotFound";

const App = () => {
    return (
        <Routes>
            {/* More general routes */}
            <Route path="/" element={<ChatPage />} />

            {/* Default fallback route (404 page) */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;
