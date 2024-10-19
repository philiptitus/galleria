import React from 'react';
import "../css/Loader.css"

const Loader = () => {
  return (
    <div className="loading" style={{ color:"red" }}>
      <div className="loading" style={{ color:"red" }}>Loading&hellip;</div>
    </div>
  );
};

export default Loader;