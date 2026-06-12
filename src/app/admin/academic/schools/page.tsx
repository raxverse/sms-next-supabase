"use client";

import { useState } from "react";
import { PageHeader, DataTable, CreateButton, StatusBadge } from "@/components/admin";

interface School {
  id: string;
  name: string;
  code: string;
  address: string;
  status: "active" | "inactive";
  students: number;
}

 const mockSchools: School[] = [
  {
    id: "1",
    name: "Delhi Public School",
    code: "DPS001",
    address: "New Delhi",
    status: "active",
    students: 1250,
  },
  {
    id: "2",
    name: "St. Xavier's School",
    code: "SXS001",
    address: "Mumbai",
    status: "active",
    students: 980,
  },
  {
    id: "3",
    name: "Greenfield Academy",
    code: "GFA001",
    address: "Bangalore",
    status: "inactive",
    students: 450,
  },
  {
    id: "4",
    name: "Sunrise International",
    code: "SUN001",
    address: "Hyderabad",
    status: "active",
    students: 875,
  },
];

export default function SchoolsPage() {
  const [schools] = useState<School[]>(mockSchools);

  const columns = [
    { key: "name", label: "School Name", sortable: true },
    { key: "code", label: "Code", sortable: true },
    { key: "address", label: "Address", sortable: false },
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
        title="Schools"
        description="Manage all schools in your system"
        action={<CreateButton onClick={() => console.log("Create school")} label="Add School" />}
      />

      <DataTable
        columns={columns}
        data={schools}
        searchableFields={["name", "code", "address"]}
        emptyMessage="No schools found"
      />
    </div>
  );
}
