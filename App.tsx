import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Ongoing from './pages/Ongoing';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import ReviewForm from './pages/ReviewForm';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="sobre" element={<About />} />
            <Route path="servicos" element={<Services />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="em-andamento" element={<Ongoing />} />
            <Route path="orcamento" element={<Contact />} />
            <Route path="avaliar" element={<ReviewForm />} />
            {/* Admin has its own internal layout logic but wrapped here for header/footer if desired, 
                usually Admin is standalone or has specific layout. 
                Here I'll render it inside Layout for consistency, but Admin page handles its internal structure. */}
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;