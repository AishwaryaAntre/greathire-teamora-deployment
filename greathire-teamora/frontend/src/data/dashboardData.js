import {
  LayoutGrid,
  Users,
  Fingerprint,
  CalendarCheck,
  BarChart3,
  Bell,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, href: "/dashboard", active: true },
  { label: "Employees", icon: Users, href: "/employees" },
  { label: "Attendance", icon: Fingerprint, href: "/attendance" },
  { label: "Leave Management", icon: CalendarCheck, href: "/leave" },
  { label: "Reports & Analytics", icon: BarChart3, href: "/reports" },
  { label: "Notifications", icon: Bell, href: "/notifications" },
];

export const SNAPSHOT_STATS = [
  { label: "Total Engineers", value: 120, percent: 100, color: "bg-slate-300" },
  { label: "Working", value: 105, percent: 88, color: "bg-primary" },
  { label: "Break", value: 12, percent: 10, color: "bg-amber-400" },
  { label: "Leave", value: 3, percent: 3, color: "bg-rose-400" },
];

export const OVERVIEW_STATS = [
  { label: "TOTAL EMPLOYEES", value: "156", tone: "neutral" },
  { label: "LIVE ONLINE", value: "142", tone: "blue", withDot: true },
  { label: "ATTENDANCE", value: "98.2%", tone: "green" },
];

export const LIVE_WORKFORCE = [
  {
    initials: "AM",
    name: "Aarav Mehta",
    role: "Frontend Eng",
    status: "working",
    checkIn: "09:05 AM",
    avatarClass: "bg-blue-100 text-blue-700",
  },
  {
    initials: "NS",
    name: "Neha Sharma",
    role: "Backend Eng",
    status: "working",
    checkIn: "09:12 AM",
    avatarClass: "bg-purple-100 text-purple-700",
  },
  {
    initials: "RK",
    name: "Rohan Kulkarni",
    role: "Software Eng",
    status: "break",
    checkIn: "08:50 AM",
    avatarClass: "bg-amber-100 text-amber-700",
  },
  {
    initials: "KD",
    name: "Karan Deshmukh",
    role: "DevOps Eng",
    status: "leave",
    checkIn: "--",
    avatarClass: "bg-rose-100 text-rose-700",
  },
];

export const RECENT_ACTIVITY = [
  {
    id: 1,
    text: "Aarav Mehta checked in",
    time: "2 mins ago",
    dotClass: "bg-emerald-500",
  },
  {
    id: 2,
    text: "Rohan Kulkarni started break",
    time: "15 mins ago",
    dotClass: "bg-amber-500",
  },
  {
    id: 3,
    text: "Neha Sharma checked in",
    time: "45 mins ago",
    dotClass: "bg-emerald-500",
  },
];
