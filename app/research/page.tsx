'use client';

import { useState, useEffect } from 'react';
import BackButton from "@/components/BackButton";

export default function ResearchPage() {
  const [search, setSearch] = useState('');
  const [researchList, setResearchList] = useState([]);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const response = await fetch(`/api/research?search=${encodeURIComponent(search)}`);
        const data = await response.json();
        setResearchList(data);
      } catch (error) {
        console.error("Error fetching research:", error);
      }
    };

    fetchResearch();
  }, [search]);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Search Research</h1>

      <input
        type="text"
        placeholder="Search for research..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchStyle}
      />

      <div style={listStyle}>
        {researchList.length > 0 ? (
          researchList.map((research: any) => (
            <div key={research.research_id} style={researchItemStyle}>
              <h3>{research.research_name}</h3>
              <p>Cited Amount: {research.cited_amount}</p>
            </div>
          ))
        ) : (
          <p>No research found.</p>
        )}
      </div>

      <BackButton />
    </div>
  );
}

// Styles
const containerStyle = { 
  maxWidth: '600px', 
  margin: 'auto', 
  textAlign: 'center', 
  padding: '20px' 
};

const titleStyle = { 
  fontSize: '24px', 
  marginBottom: '20px' 
};

const searchStyle = { 
  width: '100%', 
  padding: '10px', 
  fontSize: '16px', 
  borderRadius: '5px', 
  border: '1px solid #ccc' 
};

const listStyle = { 
  marginTop: '20px' 
};

const researchItemStyle = { 
  padding: '10px', 
  border: '1px solid #ddd', 
  borderRadius: '5px', 
  marginBottom: '10px' 
};
