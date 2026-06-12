import AdminLayout from "@/components/layouts/AdminLayout";

export default function AdminLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
