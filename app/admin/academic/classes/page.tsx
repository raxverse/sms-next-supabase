"use client";

import { useState } from "react";
import { PageHeader, DataTable, CreateButton, StatusBadge } from "@/app/components/admin";

interface Class {
  id: string;
  name: string;
  section: string;
  teacher: string;
  students: number;
  status: "active" | "inactive";
}

const mockClasses: Class[] = [
  {
    id: "1",
    name: "Class X",
    section: "A",
    teacher: "Mr. Sharma",
    students: 45,
    status: "active",
  },
  {
    id: "2",
    name: "Class X",
    section: "B",
    teacher: "Mrs. Gupta",
    students: 42,
    status: "active",
  },
  {
    id: "3",
    name: "Class IX",
    section: "A",
    teacher: "Mr. Singh",
    students: 48,
    status: "active",
  },
  {
    id: "4",
    name: "Class IX",
    section: "B",
    teacher: "Ms. Verma",
    students: 46,
    status: "active",
  },
  {
    id: "5",
    name: "Class X",
    section: "C",
    teacher: "Dr. Patel",
    students: 41,
    status: "active",
  },
  {
    id: "6",
    name: "Class VIII",
    section: "A",
    teacher: "Mr. Kumar",
    students: 50,
    status: "inactive",
  },
];

export default function ClassesPage() {
  const [classes] = useState<Class[]>(mockClasses);

  const columns = [
    { key: "name", label: "Class", sortable: true },
    { key: "section", label: "Section", sortable: true },
    { key: "teacher", label: "Class Teacher", sortable: false },
    { key: "students", label: "Students", sortable: true },
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
        title="Classes"
        description="Manage classes and sections"
        action={<CreateButton onClick={() => console.log("Create class")} label="Add Class" />}
      />

      <DataTable
        columns={columns}
        data={classes}
        searchableFields={["name", "section", "teacher"]}
        emptyMessage="No classes found"
      />
    </div>
  );
}
