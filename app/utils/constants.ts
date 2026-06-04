import {
  Home,
  Calendar,
  Users,
  GraduationCap,
  ClipboardList,
  Bus,
  MessageSquare,
  FileText,
  Settings,
  IndianRupee,
  School,
  User,
} from "lucide-react";

export const APP_COLORS = {
  primary: "#7A1421",
  primaryLight: "#F7EDEE",
  dark: "#5A1818",
  darkAlt: "#3D1515",
  text: "#6A1B1B",
  border: "#E5E7EB",
  gray: "#000000",
  grayLight: "#D1D5DB",
  grayLighter: "#F3F4F6",
  background: "#F8F5F2",
};

export const SIDEBAR_MENU_SECTIONS = [
  {
    title: "ACADEMIC MANAGEMENT",
    items: [
      { icon: School, label: "Schools", href: "/admin/schools" },
      { icon: Calendar, label: "Sessions", href: "/admin/sessions" },
      { icon: ClipboardList, label: "Classes", href: "/admin/classes" },
      { icon: ClipboardList, label: "Sections", href: "/admin/sections" },
      { icon: ClipboardList, label: "Subjects", href: "/admin/subjects" },
      { icon: User, label: "Teachers", href: "/admin/teachers" },
    ],
  },
  {
    title: "STUDENT MANAGEMENT",
    items: [
      { icon: Users, label: "Admissions", href: "/admin/admissions" },
      { icon: GraduationCap, label: "Students", href: "/admin/students" },
    ],
  },
  {
    title: "STAFF MANAGEMENT",
    items: [
      { icon: Users, label: "Teachers", href: "/admin/teachers" },
      { icon: Users, label: "Staff", href: "/admin/staff" },
    ],
  },
  {
    title: "FEE MANAGEMENT",
    items: [
      { icon: IndianRupee, label: "Fee Structure", href: "/admin/fee-structure" },
      { icon: IndianRupee, label: "Collection", href: "/admin/fee-collection" },
    ],
  },
];

export const DASHBOARD_STATS = [
  {
    id: "students",
    title: "Total Students",
    value: "12,540",
    icon: "Users",
  },
  {
    id: "teachers",
    title: "Teachers",
    value: "640",
    icon: "GraduationCap",
  },
  {
    id: "fees",
    title: "Fee Collection",
    value: "₹4.2 Cr",
    icon: "IndianRupee",
  },
  {
    id: "attendance",
    title: "Attendance Today",
    value: "96.4%",
    icon: "Calendar",
  },
  {
    id: "buses",
    title: "Active Buses",
    value: "18",
    icon: "Bus",
  },
  {
    id: "schools",
    title: "Schools Managed",
    value: "12",
    icon: "School",
  },
];

export const PENDING_ACTIONS_DATA = [
  { id: "1", name: "Admissions Pending", count: 15 },
  { id: "2", name: "TC Requests", count: 8 },
  { id: "3", name: "Certificate Requests", count: 23 },
  { id: "4", name: "Leave Requests", count: 11 },
  { id: "5", name: "Fee Approvals", count: 5 },
];

export const RECENT_ACTIVITIES_DATA = [
  { id: "1", title: "New Student Added", time: "10:30 AM" },
  { id: "2", title: "Fee Received", time: "09:45 AM" },
  { id: "3", title: "Result Published", time: "Yesterday" },
  { id: "4", title: "TC Generated", time: "Yesterday" },
];
