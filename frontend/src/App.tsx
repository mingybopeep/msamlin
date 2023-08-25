import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./containers/Auth";
import Wrapper from "./containers/Wrapper";
import Secret from "./containers/SecretRoute";

function App() {
  return (
    <BrowserRouter>
      <Wrapper>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/secret" element={<Secret />} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  );
}

export default App;
