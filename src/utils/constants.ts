import { Hop as Home, Calendar, Users, GraduationCap, ClipboardList, Bus, MessageSquare, FileText, Settings, IndianRupee, School, User, BookOpen, CreditCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Sidebar Menu Configuration
export interface SidebarMenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

export interface SidebarMenuSection {
  title: string;
  items: SidebarMenuItem[];
}

export const SIDEBAR_MENU_SECTIONS: SidebarMenuSection[] = [
  {
    title: "ACADEMIC MANAGEMENT",
    items: [
      { icon: School, label: "Schools", href: "/admin/academic/schools" },
      { icon: Calendar, label: "Sessions", href: "/admin/academic/sessions" },
      { icon: ClipboardList, label: "Classes", href: "/admin/academic/classes" },
      { icon: BookOpen, label: "Exams", href: "/admin/exams" },
    ],
  },
  {
    title: "STUDENT MANAGEMENT",
    items: [
      { icon: GraduationCap, label: "Students", href: "/admin/students" },
    ],
  },
  {
    title: "STAFF MANAGEMENT",
    items: [
      { icon: Users, label: "Staff", href: "/admin/staff" },
    ],
  },
  {
    title: "FEE MANAGEMENT",
    items: [
      { icon: IndianRupee, label: "Fees", href: "/admin/fees" },
    ],
  },
];

// Dashboard Stats Configuration
export interface DashboardStat {
  id: string;
  title: string;
  value: string;
  icon: string;
  subtitle?: string;
}

export const DASHBOARD_STATS: DashboardStat[] = [
  {
    id: "students",
    title: "Total Students",
    value: "12,540",
    icon: "Users",
    subtitle: "All Schools",
  },
  {
    id: "teachers",
    title: "Teachers",
    value: "640",
    icon: "GraduationCap",
    subtitle: "All Schools",
  },
  {
    id: "fees",
    title: "Fee Collection",
    value: "₹4.2 Cr",
    icon: "IndianRupee",
    subtitle: "This Month",
  },
  {
    id: "attendance",
    title: "Attendance Today",
    value: "96.4%",
    icon: "Calendar",
    subtitle: "Average",
  },
  {
    id: "buses",
    title: "Active Buses",
    value: "18",
    icon: "Bus",
    subtitle: "Transport",
  },
  {
    id: "schools",
    title: "Schools",
    value: "12",
    icon: "School",
    subtitle: "Managed",
  },
];

// Pending Actions Data
export interface PendingAction {
  id: string;
  name: string;
  count: number;
}

export const PENDING_ACTIONS_DATA: PendingAction[] = [
  { id: "1", name: "Admissions Pending", count: 15 },
  { id: "2", name: "TC Requests", count: 8 },
  { id: "3", name: "Certificate Requests", count: 23 },
  { id: "4", name: "Leave Requests", count: 11 },
  { id: "5", name: "Fee Approvals", count: 5 },
];

// Recent Activities Data
export interface Activity {
  id: string;
  title: string;
  time: string;
}

export const RECENT_ACTIVITIES_DATA: Activity[] = [
  { id: "1", title: "New Student Added", time: "10:30 AM" },
  { id: "2", title: "Fee Received", time: "09:45 AM" },
  { id: "3", title: "Result Published", time: "Yesterday" },
  { id: "4", title: "TC Generated", time: "Yesterday" },
];


