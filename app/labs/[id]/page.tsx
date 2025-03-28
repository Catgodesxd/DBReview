"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BackButton from "@/components/BackButton";

type Lab = {
  lab_id: number;
  lab_name: string;
  lab_description: string;
  professors: string; // Comma-separated list of professor names
};

export default function LabPage() {
  const params = useParams();
  const id = params?.id as string | undefined; // Ensure correct type

  const [lab, setLab] = useState<Lab | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/labs/${id}`)
        .then((res) => res.json())
        .then((data: Lab) => {
          setLab(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!lab) {
    return <p>Lab not found</p>;
  }

  return (
    <div>
      <h1>Lab: {lab.lab_name}</h1>
      <p>Description: {lab.lab_description}</p>
      <p>Professors: {lab.professors}</p>

      <BackButton /> {/* ✅ Add Floating Back Button */}
    </div>
  );
}
