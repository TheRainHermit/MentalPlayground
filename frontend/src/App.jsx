import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Las12Monedas from "./games/Las12Monedas";
import AdivinaElNumero from "./games/AdivinaElNumero";
import TorresDeHanoi from "./games/TorresDeHanoi";
import LoboCabraYCol from "./games/LoboCabraYCol";
import NReinas from "./games/NReinas";
import Sudoku from "./games/Sudoku";
import TresEnRaya from "./games/TresEnRaya";
import Conecta4 from "./games/Conecta4";
import LaberintosBFSDFS from "./games/LaberintosBFSDFS";
import Nim from "./games/JuegoDelNim";
import PuenteAntorcha from "./games/PuenteYLaAntorcha";
import OrdenamientoCartas from "./games/OrdenamientoConCartas";
import CarteroChino from "./games/ProblemaDelCarteroChino";
import Ajedrez from "./games/Ajedrez";
import Navbar from "./components/Navbar";
import Acerca from "./pages/About";
import Juegos from "./pages/Games";
import Ayuda from "./pages/Help";
import Contacto from "./pages/Contact";


function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acerca" element={<Acerca />} />
        <Route path="/juegos" element={<Juegos />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
