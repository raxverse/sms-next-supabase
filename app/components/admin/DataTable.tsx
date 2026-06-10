"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ReactNode } from "react";

interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => ReactNode;
  width?: string;
}

interface DataTableProps {
  columns: DataTableColumn[];
  data: Record<string, any>[];
  searchableFields?: string[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function DataTable({
  columns,
  data,
  searchableFields = [],
  isLoading = false,
  emptyMessage = "No data found",
}: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    let result = data;

    // Filter by search
    if (searchTerm && searchableFields.length > 0) {
      result = result.filter((row) =>
        searchableFields.some((field) =>
          String(row[field])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, sortKey, sortOrder, searchTerm, searchableFields]);

  const handleSort = (key: string) => {
    if (!columns.find((col) => col.key === key)?.sortable) return;

    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-left text-sm font-semibold text-slate-700 ${
                    col.sortable
                      ? "cursor-pointer hover:bg-slate-100"
                      : ""
                  }`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <>
                        {sortOrder === "asc" ? (
                          <ChevronUp size={14} className="text-blue-600" />
                        ) : (
                          <ChevronDown size={14} className="text-blue-600" />
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 text-sm text-slate-900"
                      style={{ width: col.width }}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="text-sm text-slate-600">
        Showing {filteredData.length} of {data.length} items
      </div>
    </div>
  );
}
