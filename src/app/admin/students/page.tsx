"use client";

import { useState } from "react";
import { PageHeader, DataTable, CreateButton, StatusBadge } from "@/components/admin";

interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  section: string;
  parentPhone: string;
  status: "active" | "inactive";
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Aarav Patel",
    rollNo: "10001",
    class: "X",
    section: "A",
    parentPhone: "+91-9876543210",
    status: "active",
  },
  {
    id: "2",
    name: "Anika Sharma",
    rollNo: "10002",
    class: "X",
    section: "A",
    parentPhone: "+91-9876543211",
    status: "active",
  },
  {
    id: "3",
    name: "Rohan Singh",
    rollNo: "10003",
    class: "X",
    section: "B",
    parentPhone: "+91-9876543212",
    status: "active",
  },
  {
    id: "4",
    name: "Priya Kapoor",
    rollNo: "10004",
    class: "IX",
    section: "A",
    parentPhone: "+91-9876543213",
    status: "active",
  },
  {
    id: "5",
    name: "Vikram Kumar",
    rollNo: "10005",
    class: "X",
    section: "C",
    parentPhone: "+91-9876543214",
    status: "inactive",
  },
  {
    id: "6",
    name: "Sneha Gupta",
    rollNo: "10006",
    class: "IX",
    section: "B",
    parentPhone: "+91-9876543215",
    status: "active",
  },
];

export default function StudentsPage() {
  const [students] = useState<Student[]>(mockStudents);

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "rollNo", label: "Roll No.", sortable: true },
    { key: "class", label: "Class", sortable: true },
    { key: "section", label: "Section", sortable: true },
    { key: "parentPhone", label: "Parent Contact", sortable: false },
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
        title="Students"
        description="View and manage student records"
        action={<CreateButton onClick={() => console.log("Create student")} label="Add Student" />}
      />

      <DataTable
        columns={columns}
        data={students}
        searchableFields={["name", "rollNo", "class"]}
        emptyMessage="No students found"
      />
    </div>
  );
}
