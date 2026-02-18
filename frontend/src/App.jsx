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

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/las12monedas" element={<Las12Monedas />} />
        <Route path="/adivinaelnumero" element={<AdivinaElNumero />} />
        <Route path="/torresdehanoi" element={<TorresDeHanoi />} />
        <Route path="/lobocabra" element={<LoboCabraYCol />} />
        <Route path="/nreinas" element={<NReinas />} />
        <Route path="/sudoku" element={<Sudoku />} />
        <Route path="/tresenraya" element={<TresEnRaya />} />
        <Route path="/conecta4" element={<Conecta4 />} />
        <Route path="/laberintos" element={<LaberintosBFSDFS />} />
        <Route path="/nim" element={<Nim />} />
        <Route path="/puente" element={<PuenteAntorcha />} />
        <Route path="/ordenamientocartas" element={<OrdenamientoCartas />} />
        <Route path="/carterochino" element={<CarteroChino />} />
        <Route path="/ajedrez" element={<Ajedrez />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
