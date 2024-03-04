import React from "react";
import Home from "./Home";
import About from "./About";
import Login from "./Login";
import Links from "./Links";
import Addlink from "./Addlink";
import MeinBereich from "./MeinBereich";
import Header from "./Header";
import Footer from "./Footer";
import MainContainer from "./MainContainer";
import { Routes, Route } from "react-router-dom";

function App() {
  const appStyles = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundImage: 'url(https://frontend.devops-knowledge.de)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  };

  const footerStyles = {
    flexShrink: 0,
  };

  return (
    <div className="App" style={appStyles}>
      <Header />
      <MainContainer>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='about' element={<About/>} />
          <Route path='login' element={<Login/>} />
          <Route path='myspace' element={<MeinBereich/>} />
          <Route path='links' element={<Links/>} />
          <Route path='addlink' element={<Addlink/>} />
        </Routes>
      </MainContainer>
      <Footer style={footerStyles} />
    </div>
  );
}

export default App;
