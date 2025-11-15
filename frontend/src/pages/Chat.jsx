import React from "react";

export default function Chat() {

  const handleGenerate= async() => {
    try {

    } catch(error) {

    }
  }
 return(
  <div>
    <section className="search-section">
      <h2>Ask AI</h2>
      <input placeholder="ask anything about product?" onClick={handleGenerate}/>

    </section>
  </div>
 )
}