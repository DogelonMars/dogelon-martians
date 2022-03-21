import "./App.css";
import styled from "styled-components";

import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Footer from "./components/Footer"
import { Web3ModalProvider } from "./Web3ModalContext";

function App() {
  return (
    <Web3ModalProvider>
      <Container>
        <Navbar />
        <Landing/>
        <Footer />
      </Container>
    </Web3ModalProvider>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  height: 100%;
  width: 100%;
  
  &> * {
    flex-shrink: 0;
  }
`;
