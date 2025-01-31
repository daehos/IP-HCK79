import { createRoot } from "react-dom/client";

// import "./index.css";
import "./index.css"; // atau sesuaikan dengan lokasi CSS kamu

import { BrowserRouter, Route, Routes } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import CreateJournal from "./pages/CreateJournal";
import UpdateJournal from "./pages/UpdateJournal";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import UnauthLayout from "./layout/UnauthLayout";
import AuthLayout from "./layout/AuthLayout";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route element={<UnauthLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/create-journal" element={<CreateJournal />} />
          <Route path="/edit-journals/:id" element={<UpdateJournal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
