'use client';

import { useState, useEffect } from 'react';
import BackButton from "@/components/BackButton";

export default function LabPage() {
  const [search, setSearch] = useState('');
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await fetch(`/api/labs?search=${encodeURIComponent(search)}`);
        const data = await response.json();
        setLabs(data);
      } catch (error) {
        console.error("Error fetching labs:", error);
      }
    };

    fetchLabs();
  }, [search]);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Search Labs</h1>

      <input
        type="text"
        placeholder="Search for a lab..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchStyle}
      />

      <div style={listStyle}>
        {labs.length > 0 ? (
          labs.map((lab: any) => (
            <div key={lab.lab_id} style={labItemStyle}>
              <h3>{lab.lab_name}</h3>
              <p>{lab.lab_description}</p>

              {lab.professors && lab.professors.length > 0 ? (
                <div>
                  <h4>Professors:</h4>
                  <ul>
                    {lab.professors.map((professor: any) => (
                      <li key={professor.professor_id}>
                        {professor.professor_name} - {professor.professor_email}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No professors assigned.</p>
              )}
            </div>
          ))
        ) : (
          <p>No labs found.</p>
        )}
      </div>

      <BackButton />
    </div>
  );
}

// Styles
const containerStyle = { maxWidth: '600px', margin: 'auto', textAlign: 'center', padding: '20px' };
const titleStyle = { fontSize: '24px', marginBottom: '20px' };
const searchStyle = { width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' };
const listStyle = { marginTop: '20px' };
const labItemStyle = { padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '10px' };
