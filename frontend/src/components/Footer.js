import React from "react";

const Footer = () => {
  return (
    <footer style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      backgroundColor: "lightgray",
      padding: "10px 0",
      textAlign: "center"
    }}>
      <div className="container text-center">
        <a href="https://twitter.com/TweetsOfCats" className="text-dark me-3" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://www.linkedin.com/company/cats" className="text-dark me-3" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/erdal2021/projektCMS-v0.1.git" className="text-dark" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </footer>
  );
}

export default Footer;

