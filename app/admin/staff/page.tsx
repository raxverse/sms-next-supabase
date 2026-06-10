"use client";

import { useState } from "react";
import { PageHeader, DataTable, CreateButton, StatusBadge } from "@/app/components/admin";

interface Staff {
  id: string;
  name: string;
  employeeId: string;
  position: string;
  department: string;
  email: string;
  status: "active" | "inactive";
}

const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Mr. Rajesh Sharma",
    employeeId: "EMP001",
    position: "Mathematics Teacher",
    department: "Academic",
    email: "rajesh.sharma@school.com",
    status: "active",
  },
  {
    id: "2",
    name: "Mrs. Priya Gupta",
    employeeId: "EMP002",
    position: "English Teacher",
    department: "Academic",
    email: "priya.gupta@school.com",
    status: "active",
  },
  {
    id: "3",
    name: "Mr. Vikram Singh",
    employeeId: "EMP003",
    position: "Accountant",
    department: "Administration",
    email: "vikram.singh@school.com",
    status: "active",
  },
];

export default function StaffPage() {
  const [staff] = useState<Staff[]>(mockStaff);

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "employeeId", label: "Employee ID", sortable: true },
    { key: "position", label: "Position", sortable: true },
    { key: "department", label: "Department", sortable: false },
    { key: "email", label: "Email", sortable: false },
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
        title="Staff"
        description="Manage staff members and teachers"
        action={<CreateButton onClick={() => console.log("Create staff")} label="Add Staff" />}
      />

      <DataTable
        columns={columns}
        data={staff}
        searchableFields={["name", "employeeId", "position"]}
        emptyMessage="No staff members found"
      />
    </div>
  );
}
