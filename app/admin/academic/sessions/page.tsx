"use client";

import { useState } from "react";
import { PageHeader, DataTable, CreateButton, StatusBadge } from "@/app/components/admin";

interface Session {
  id: string;
  name: string;
  year: string;
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "completed";
  school: string;
}

const mockSessions: Session[] = [
  {
    id: "1",
    name: "Session 2023-24",
    year: "2023-24",
    startDate: "April 1, 2023",
    endDate: "March 31, 2024",
    status: "completed",
    school: "DPS Delhi",
  },
  {
    id: "2",
    name: "Session 2024-25",
    year: "2024-25",
    startDate: "April 1, 2024",
    endDate: "March 31, 2025",
    status: "active",
    school: "DPS Delhi",
  },
  {
    id: "3",
    name: "Session 2025-26",
    year: "2025-26",
    startDate: "April 1, 2025",
    endDate: "March 31, 2026",
    status: "inactive",
    school: "DPS Delhi",
  },
  {
    id: "4",
    name: "Session 2024-25",
    year: "2024-25",
    startDate: "April 1, 2024",
    endDate: "March 31, 2025",
    status: "active",
    school: "St. Xavier's School",
  },
];

export default function SessionsPage() {
  const [sessions] = useState<Session[]>(mockSessions);

  const columns = [
    { key: "name", label: "Session", sortable: true },
    { key: "year", label: "Year", sortable: true },
    { key: "startDate", label: "Start Date", sortable: false },
    { key: "endDate", label: "End Date", sortable: false },
    { key: "school", label: "School", sortable: false },
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
        title="Academic Sessions"
        description="Manage academic sessions and years"
        action={<CreateButton onClick={() => console.log("Create session")} label="Add Session" />}
      />

      <DataTable
        columns={columns}
        data={sessions}
        searchableFields={["name", "year"]}
        emptyMessage="No sessions found"
      />
    </div>
  );
}
