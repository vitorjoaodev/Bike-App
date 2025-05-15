import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import SplashScreen from '../components/SplashScreen';
import ReferralSnackbar from '../components/ReferralSnackbar';

// Importamos o componente Home dinamicamente para evitar problemas com SSR
// devido aos componentes do mapa (Leaflet) que precisam do window
const HomePage = dynamic(
  () => import('../client/src/pages/Home').then((mod) => mod.default),
  { ssr: false }
);

const Index: NextPage = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showReferralSnackbar, setShowReferralSnackbar] = useState(false);
  
  // Mostrar o snackbar após um curto delay depois que o splash screen terminar
  useEffect(() => {
    if (!showSplash) {
      const timer = setTimeout(() => {
        setShowReferralSnackbar(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSplash]);
  
  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  
  return (
    <>
      <Head>
        <title>BikeShare SP | Aluguel de Bicicletas em São Paulo</title>
        <meta name="description" content="Alugue bicicletas em São Paulo com facilidade. Encontre estações próximas, escolha sua bicicleta e explore a cidade com o BikeShare SP." />
        <meta name="keywords" content="aluguel de bicicletas, são paulo, bike sharing, bicicletas compartilhadas, mobilidade urbana" />
        <meta property="og:title" content="BikeShare SP | Aluguel de Bicicletas em São Paulo" />
        <meta property="og:description" content="Alugue bicicletas em São Paulo com facilidade. Encontre estações próximas, escolha sua bicicleta e explore a cidade." />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:url" content="https://bikeshare-sp.com.br" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://bikeshare-sp.com.br" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </Head>
      
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <HomePage />
      
      <ReferralSnackbar 
        show={showReferralSnackbar} 
        onClose={() => setShowReferralSnackbar(false)} 
      />
    </>
  );
};

export default Index;