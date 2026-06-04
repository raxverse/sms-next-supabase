import AdminLayout from "@/app/components/layouts/AdminLayout";

export default function AdminLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
