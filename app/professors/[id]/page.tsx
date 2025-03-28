"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BackButton from "@/components/BackButton";

type Lab = {
  lab_id: number;
  lab_name: string;
  lab_description: string;
};

type Research = {
  research_id: number;
  research_name: string;
  cited_amount: number;
};

type Professor = {
  professor_id: number;
  professor_name: string;
  professor_email: string;
  labs: Lab[];
  research: Research[];
};

export default function ProfessorPage() {
  const { id } = useParams();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid professor ID");
      setLoading(false);
      return;
    }

    fetch(`/api/professors/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Unknown error");
        }
        return res.json();
      })
      .then((data) => {
        setProfessor(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!professor) return <p>Professor not found</p>;

  return (
    <div>
      <h1>{professor.professor_name}</h1>
      <p>Email: {professor.professor_email}</p>

      <h2>Labs</h2>
      {professor.labs.length > 0 ? (
        <ul>
          {professor.labs.map((lab) => (
            <li key={lab.lab_id}>
              <a href={`/labs/${lab.lab_id}`}>{lab.lab_name}</a> - {lab.lab_description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No labs available</p>
      )}

      <h2>Research</h2>
      {professor.research.length > 0 ? (
        <ul>
          {professor.research.map((res) => (
            <li key={res.research_id}>
              {res.research_name} (Cited: {res.cited_amount})
            </li>
          ))}
        </ul>
      ) : (
        <p>No research available</p>
      )}

        <BackButton /> {/* ✅ Add Floating Back Button */}
    </div>
  );
}
