import React, { useState, useEffect } from "react";


const Home: React.FC = () => {
  const [content] = useState<string>("");

  useEffect(() => {

  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default Home;
