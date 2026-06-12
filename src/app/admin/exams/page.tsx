"use client";

import { useState } from "react";
import { PageHeader, DataTable, CreateButton, StatusBadge } from "@/components/admin";

interface Exam {
  id: string;
  name: string;
  class: string;
  subject: string;
  date: string;
  totalMarks: number;
  status: "pending" | "completed" | "cancelled";
}

const mockExams: Exam[] = [
  {
    id: "1",
    name: "Mid-Term 2024",
    class: "X-A",
    subject: "Mathematics",
    date: "July 15, 2024",
    totalMarks: 100,
    status: "completed",
  },
  {
    id: "2",
    name: "Mid-Term 2024",
    class: "X-A",
    subject: "English",
    date: "July 18, 2024",
    totalMarks: 100,
    status: "completed",
  },
  {
    id: "3",
    name: "Final Exam 2024",
    class: "X-A",
    subject: "Science",
    date: "August 20, 2024",
    totalMarks: 100,
    status: "pending",
  },
  {
    id: "4",
    name: "Mid-Term 2024",
    class: "IX-A",
    subject: "Mathematics",
    date: "July 10, 2024",
    totalMarks: 80,
    status: "completed",
  },
  {
    id: "5",
    name: "Final Exam 2024",
    class: "X-B",
    subject: "History",
    date: "August 25, 2024",
    totalMarks: 100,
    status: "pending",
  },
  {
    id: "6",
    name: "Mid-Term 2024",
    class: "X-C",
    subject: "Geography",
    date: "July 12, 2024",
    totalMarks: 100,
    status: "completed",
  },
];

export default function ExamsPage() {
  const [exams] = useState<Exam[]>(mockExams);

  const columns = [
    { key: "name", label: "Exam", sortable: true },
    { key: "class", label: "Class", sortable: true },
    { key: "subject", label: "Subject", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "totalMarks", label: "Total Marks", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: false,
      render: (status: string) => <StatusBadge status={status as any} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Exams"
        description="Manage exams and assessments"
        action={<CreateButton onClick={() => console.log("Create exam")} label="Create Exam" />}
      />

      <DataTable
        columns={columns}
        data={exams}
        searchableFields={["name", "class", "subject"]}
        emptyMessage="No exams found"
      />
    </div>
  );
}
