"use client";

import { useState } from "react";
import { PageHeader, DataTable, CreateButton, StatusBadge } from "@/components/admin";

interface Fee {
  id: string;
  studentName: string;
  class: string;
  amount: number;
  dueDate: string;
  status: "completed" | "pending" | "overdue";
  paidDate?: string;
}

const mockFees: Fee[] = [
  {
    id: "1",
    studentName: "Aarav Patel",
    class: "X-A",
    amount: 15000,
    dueDate: "June 15, 2024",
    status: "completed",
    paidDate: "June 10, 2024",
  },
  {
    id: "2",
    studentName: "Anika Sharma",
    class: "X-A",
    amount: 15000,
    dueDate: "June 15, 2024",
    status: "pending",
  },
  {
    id: "3",
    studentName: "Rohan Singh",
    class: "X-B",
    amount: 15000,
    dueDate: "May 31, 2024",
    status: "overdue",
  },
  {
    id: "4",
    studentName: "Priya Kapoor",
    class: "IX-A",
    amount: 14000,
    dueDate: "June 20, 2024",
    status: "completed",
    paidDate: "June 18, 2024",
  },
  {
    id: "5",
    studentName: "Vikram Kumar",
    class: "X-C",
    amount: 15000,
    dueDate: "June 15, 2024",
    status: "pending",
  },
  {
    id: "6",
    studentName: "Sneha Gupta",
    class: "IX-B",
    amount: 14000,
    dueDate: "June 20, 2024",
    status: "completed",
    paidDate: "June 19, 2024",
  },
];

export default function FeesPage() {
  const [fees] = useState<Fee[]>(mockFees);

  const columns = [
    { key: "studentName", label: "Student Name", sortable: true },
    { key: "class", label: "Class", sortable: true },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
    { key: "dueDate", label: "Due Date", sortable: false },
    { key: "paidDate", label: "Paid Date", sortable: false },
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
        title="Fee Management"
        description="Track and manage student fees"
        action={<CreateButton onClick={() => console.log("Add fee")} label="Record Payment" />}
      />

      <DataTable
        columns={columns}
        data={fees}
        searchableFields={["studentName", "class"]}
        emptyMessage="No fee records found"
      />
    </div>
  );
}
