// import React from "react";
// import "./App.css"
// import Home from "./Home";
// import About from "./About";
// import Addlink from "./Addlink";
// import Links from "./Links";
// import Login from "./Login";
// import Register from "./Register";
// import Header from "./Header";
// import Footer from "./Footer";
// import MainContainer from "./MainContainer";
// import { Routes, Route } from "react-router-dom";

// function App() {
//   return (
//      <div className="App">
//        <Header />
//        <MainContainer>
//          <Routes>
//            <Route path='/' element={<Home />} />
//            <Route path='about' element={<About />} />
//            <Route path='addlink' element={<Addlink />} />
//            <Route path='links' element={<Links />} />
//            <Route path='login' element={<Login />} />
//            <Route path='register' element={<Register />} />
//          </Routes>
//        </MainContainer>
//        <Footer />
//      </div>
//    );
//  }
 
// export default App;
import React from "react";
import "./App.css"
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
 return (
    <div className="App">
       <Header />
       <MainContainer>
         <Routes>
        <Route path='/' element={ <Home/> } />
        <Route path='about' element={ <About/> } />
        <Route path='login' element={ <Login/> } />
        <Route path='myspace' element={ <MeinBereich/> } />
        <Route path='links' element={ <Links/> } />
        <Route path='addlink' element={ <Addlink/> } />
        </Routes>
       </MainContainer>
       <Footer />
    </div>
  );
}

export default App