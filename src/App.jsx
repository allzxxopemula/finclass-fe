import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import LupaPassword from './pages/LupaPassword';
import Register from './pages/Register';
import Home from './pages/Home';
import Penarikan from './pages/Penarikan';
import PenarikanTambah from './pages/PenarikanTambah';
import History from './pages/History';
import Profile from './pages/Profile';

import SettingProfile from './pages/SettingProfile';
import SettingAnggota from './pages/SettingAnggota';
import SettingKelas from './pages/SettingKelas';
import AksiKelas from './pages/AksiKelas';
import ProteksiAkun from './pages/ProteksiAkun';
import Faq from './pages/Faq';
import InputSaldoAwal from './pages/InputSaldoAwal';

export default function App() {
  const savedUser = localStorage.getItem('user');

  return (
    <Router>
      <Routes>
        <Route path="/" element={savedUser ? <Navigate to="/home" replace /> : <LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lupa-password" element={<LupaPassword />} />
        <Route path="/register" element={<Register />} />
        
        {/* Halaman utama (sudah handle MainLayout sendiri di dalam filenya) */}
        <Route path="/home" element={<Home />} />
        <Route path="/penarikan" element={<Penarikan />} />
        <Route path="/penarikan/tambah" element={<PenarikanTambah />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />

        {/* Settings Routes */}
        <Route path="/settings/profile" element={<SettingProfile />} />
        <Route path="/settings/anggota" element={<SettingAnggota />} />
        <Route path="/settings/kelas" element={<SettingKelas />} />
        <Route path="/settings/aksi-kelas" element={<AksiKelas />} />
        <Route path="/settings/security" element={<ProteksiAkun />} />
        <Route path="/settings/faq" element={<Faq />} />
        <Route path="/settings/input-saldo-awal" element={<InputSaldoAwal />} />
      </Routes>
    </Router>
  );
}