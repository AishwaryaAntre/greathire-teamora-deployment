import React, { useState } from "react";
import {
  LayoutGrid,
  Building2,
  MessageSquare,
  ListChecks,
  CalendarCheck,
  BarChart3,
  Settings,
  Phone,
  Video,
  Search,
  MoreVertical,
  Code2,
  ThumbsUp,
  MessageCircle,
  Paperclip,
  Smile,
  AtSign,
  Send,
  Bold,
  Italic,
  Folder,
  Link2,
  User,
  HelpCircle,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Static data                                                                */
/* -------------------------------------------------------------------------- */

const navItems = [
  { label: "Organization", icon: Building2 },
  { label: "Messages", icon: MessageSquare, active: true },
  { label: "Tasks", icon: ListChecks },
  { label: "Attendance", icon: CalendarCheck },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

const channels = [
  { label: "General" },
  { label: "Engineering", active: true, unread: 3 },
  { label: "Frontend" },
  { label: "Backend" },
  { label: "DevOps" },
];

const directMessages = [
  { name: "Swaraj", avatar: "https://i.pravatar.cc/64?img=51", active: true },
  { name: "Aarav", avatar: "https://i.pravatar.cc/64?img=13" },
  { name: "Neha", avatar: "https://i.pravatar.cc/64?img=25" },
];

const contact = {
  name: "Swaraj Kadam",
  role: "Software Engineer",
  status: "Active now",
  avatar: "https://i.pravatar.cc/160?img=51",
};

const activityStats = [
  { label: "Commits", value: "12" },
  { label: "PRs Reviewed", value: "3" },
];

const sharedFiles = [
  { name: "Sprint_Report.pdf", note: "2.4 MB • Yesterday", tone: "bg-red-50 text-red-500" },
  { name: "Dashboard_UI_v2.fig", note: "Shared • Tuesday", tone: "bg-purple-50 text-purple-500" },
];

const sharedLinks = [
  { label: "github.com/greathi", note: "Sent today at 10:18 AM" },
  { label: "jira.atlassia", note: "Sent Monday" },
];

/* -------------------------------------------------------------------------- */
/* Left sidebar                                                              */
/* -------------------------------------------------------------------------- */

function Sidebar() {
  return (
    <aside className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0">
      <div className="min-h-0 overflow-y-auto">
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-white font-semibold text-sm">Teamora</p>
            <p className="text-slate-400 text-xs">Remote Engineering</p>
          </div>
        </div>

        <nav className="px-3 flex flex-col gap-1 mb-6">
          {navItems.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-5">
          <p className="text-[11px] font-semibold text-slate-500 tracking-wider mb-2">
            CHANNELS
          </p>
          <div className="flex flex-col gap-0.5 mb-6">
            {channels.map(({ label, active, unread }) => (
              <button
                key={label}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <span># {label}</span>
                {unread && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          <p className="text-[11px] font-semibold text-slate-500 tracking-wider mb-2">
            DIRECT MESSAGES
          </p>
          <div className="flex flex-col gap-0.5">
            {directMessages.map(({ name, avatar, active }) => (
              <button
                key={name}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <img
                  src={avatar}
                  alt={name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-5 pt-3 flex flex-col gap-3 border-t border-slate-800">
        <button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2.5 rounded-lg">
          Invite Team
        </button>
        <div className="flex items-center justify-around text-slate-400">
          <button className="flex items-center gap-1.5 text-xs hover:text-white">
            <User className="w-4 h-4" />
            Profile
          </button>
          <button className="flex items-center gap-1.5 text-xs hover:text-white">
            <HelpCircle className="w-4 h-4" />
            Help
          </button>
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* Chat header                                                                */
/* -------------------------------------------------------------------------- */

function ChatHeader() {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            {contact.name}
            <span className="bg-slate-100 text-slate-500 text-[11px] font-medium px-2 py-0.5 rounded-md">
              {contact.role}
            </span>
          </p>
          <p className="text-xs text-emerald-500">{contact.status}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-slate-500">
        <button className="hover:text-slate-700">
          <Phone className="w-4.5 h-4.5" />
        </button>
        <button className="hover:text-slate-700">
          <Video className="w-4.5 h-4.5" />
        </button>
        <span className="w-px h-5 bg-slate-200" />
        <button className="hover:text-slate-700">
          <Search className="w-4.5 h-4.5" />
        </button>
        <button className="hover:text-slate-700">
          <MoreVertical className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Message thread                                                             */
/* -------------------------------------------------------------------------- */

function PRCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mt-2 max-w-md">
      <div className="flex items-center gap-2 mb-1.5">
        <Code2 className="w-4 h-4 text-slate-500" />
        <p className="text-sm font-semibold text-slate-900">
          Frontend Dashboard - PR #142
        </p>
      </div>
      <p className="text-xs text-slate-500 mb-3">
        Fix: Navigation rendering bug on mobile viewports.
      </p>
      <div className="flex items-center gap-2">
        <button className="flex-1 border border-slate-200 rounded-lg py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
          View Details
        </button>
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg py-1.5 text-xs font-medium text-white">
          Open Repository
        </button>
      </div>
    </div>
  );
}

function MessageThread() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="flex justify-center mb-6">
        <span className="bg-slate-100 text-slate-500 text-xs font-medium px-3 py-1 rounded-full">
          Today
        </span>
      </div>

      {/* Aarav's message */}
      <div className="flex items-start gap-3 mb-6 max-w-xl">
        <img
          src="https://i.pravatar.cc/64?img=13"
          alt="Aarav"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div>
          <p className="text-sm mb-1">
            <span className="font-semibold text-slate-900">Aarav</span>
            <span className="text-xs text-slate-400 ml-2">10:15 AM</span>
          </p>
          <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-700">
            Hey Swaraj, Can you review the latest frontend PR? We need it
            deployed before the afternoon standup.
          </div>
        </div>
      </div>

      {/* Swaraj's reply */}
      <div className="flex items-start gap-3 mb-2 max-w-xl ml-auto flex-row-reverse">
        <img
          src="https://i.pravatar.cc/64?img=51"
          alt="Swaraj Kadam"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div>
          <p className="text-sm mb-1 text-right">
            <span className="text-xs text-slate-400 mr-2">10:18 AM</span>
            <span className="font-semibold text-slate-900">Swaraj Kadam</span>
          </p>
          <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm">
            Sure thing. Looking at it now. Sharing the GitHub link so Neha can
            check the UI changes too.
          </div>
          <PRCard />
          <div className="flex items-center gap-2 mt-2 justify-end">
            <span className="bg-slate-100 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <ThumbsUp className="w-3 h-3 text-blue-500" /> 1
            </span>
            <span className="bg-slate-100 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <MessageCircle className="w-3 h-3 text-slate-400" /> 2
            </span>
          </div>
        </div>
      </div>

      {/* Neha's message */}
      <div className="flex items-start gap-3 mt-6 mb-2 max-w-xl">
        <img
          src="https://i.pravatar.cc/64?img=25"
          alt="Neha"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div>
          <p className="text-sm mb-1">
            <span className="font-semibold text-slate-900">Neha</span>
            <span className="text-xs text-slate-400 ml-2">10:25 AM</span>
          </p>
          <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-700">
            Looks good from my end. The spacing matches the Figma spec
            perfectly now. Let's deploy after QA signs off.
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4 ml-11">Swaraj is typing...</p>
    </div>
  );
}

function MessageInput() {
  return (
    <div className="border-t border-slate-200 bg-white px-6 py-4 flex-shrink-0">
      <div className="border border-slate-200 rounded-xl px-4 py-2.5">
        <input
          type="text"
          placeholder="Message Swaraj..."
          className="w-full text-sm outline-none placeholder-slate-400 mb-2"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-400">
            <button className="hover:text-slate-600">
              <Bold className="w-4 h-4" />
            </button>
            <button className="hover:text-slate-600">
              <Italic className="w-4 h-4" />
            </button>
            <button className="hover:text-slate-600">
              <Paperclip className="w-4 h-4" />
            </button>
            <button className="hover:text-slate-600">
              <Smile className="w-4 h-4" />
            </button>
            <button className="hover:text-slate-600">
              <AtSign className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg">
            Send
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Right profile panel                                                       */
/* -------------------------------------------------------------------------- */

function ProfilePanel() {
  return (
    <aside className="w-72 h-full bg-white border-l border-slate-200 flex-shrink-0 overflow-y-auto p-6">
      <div className="flex flex-col items-center text-center mb-6">
        <img
          src={contact.avatar}
          alt={contact.name}
          className="w-20 h-20 rounded-full object-cover mb-3"
        />
        <p className="text-base font-bold text-slate-900">{contact.name}</p>
        <p className="text-sm text-slate-500">{contact.role}</p>
        <div className="flex items-center gap-2 mt-4 w-full">
          <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 rounded-lg">
            Profile
          </button>
          <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 rounded-lg">
            Mute
          </button>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 mb-4">
        <p className="text-sm font-semibold text-slate-900 mb-3">
          Today's Activity
        </p>
        <div className="grid grid-cols-2 gap-3">
          {activityStats.map(({ label, value }) => (
            <div key={label} className="bg-white rounded-lg p-3">
              <p className="text-[11px] text-slate-400 mb-1">{label}</p>
              <p className="text-lg font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <Folder className="w-4 h-4 text-slate-400" />
            Shared Files
          </p>
          <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
            View All
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {sharedFiles.map(({ name, note, tone }) => (
            <div key={name} className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${tone}`}
              >
                <Folder className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {name}
                </p>
                <p className="text-xs text-slate-400">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 mb-3">
          <Link2 className="w-4 h-4 text-slate-400" />
          Shared Links
        </p>
        <div className="flex flex-col gap-2">
          {sharedLinks.map(({ label, note }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Link2 className="w-4 h-4 text-slate-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-blue-600 truncate">
                  {label}
                </p>
                <p className="text-xs text-slate-400">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* Main export                                                                */
/* -------------------------------------------------------------------------- */

export default function MessagesPage() {
  return (
    <div className="w-screen h-screen overflow-hidden flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <ChatHeader />
        <MessageThread />
        <MessageInput />
      </div>
      <ProfilePanel />
    </div>
  );
}
