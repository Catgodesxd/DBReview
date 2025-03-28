"use client";

import { useState, useEffect } from 'react';
import BackButton from "@/components/BackButton";

export default function ProfessorPage() {
  const [search, setSearch] = useState('');
  const [professors, setProfessors] = useState([]);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await fetch(`/api/professors?search=${encodeURIComponent(search)}`);
        const data = await response.json();
        setProfessors(data);
      } catch (error) {
        console.error("Error fetching professors:", error);
      }
    };

    fetchProfessors();
  }, [search]);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Search Professors</h1>

      <input
        type="text"
        placeholder="Search for a professor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchStyle}
      />

      <div style={listStyle}>
        {professors.length > 0 ? (
          professors.map((prof: any) => (
            <div key={prof.professor_id} style={professorItemStyle}>
              <h3>{prof.professor_name}</h3>
              <p>Email: {prof.professor_email}</p>
              <p>Rating: {prof.rating !== null ? Number(prof.rating).toFixed(2) : "No ratings yet"}</p>
            </div>
          ))
        ) : (
          <p>No professors found.</p>
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

const professorItemStyle = { 
  padding: '10px', 
  border: '1px solid #ddd', 
  borderRadius: '5px', 
  marginBottom: '10px' 
};

