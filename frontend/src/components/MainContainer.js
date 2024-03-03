import React from "react";

const MainContainer = ({ children }) => {
  return (
    <div className="bg-white card rounded-3 mx-auto my-3 p-3" style={{ width: "70%" }}>
      {children}
    </div>
  );
}

export default MainContainer;
