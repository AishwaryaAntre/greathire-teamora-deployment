import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Building2,
  MessageSquare,
  ListChecks,
  CalendarCheck,
  BarChart3,
  Phone,
  Video,
  Search,
  MoreVertical,
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
  Hash,
  Plus,
  Settings2,
} from "lucide-react";
import { messagesApi } from "@/lib/api/messages";
import { useAuth } from "@/lib/AuthContext";
import ManageChannelModal from "@/components/employee/ManageChannelModal";

const navItems = [
  { label: "Organization", icon: Building2, to: "/dashboard" },
  { label: "Messages", icon: MessageSquare, active: true, to: "/messages" },
  { label: "Leaves", icon: ListChecks, to: "/leave" },
  { label: "Analytics", icon: BarChart3, to: "/reports" },
];

function ConversationSidebar({ conversations, activeId, onSelect, isAdmin, onNewChannel, onManageChannel }) {
  const navigate = useNavigate();
  const channels = conversations.filter((c) => c.type === "channel");
  const dms = conversations.filter((c) => c.type === "dm");

  return (
    <aside className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0">
      <div className="min-h-0 overflow-y-auto">
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-white font-semibold text-sm">Teamora</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs">Remote Engineering</p>
          </div>
        </div>

        <nav className="px-3 flex flex-col gap-1 mb-6">
          {navItems.map(({ label, icon: Icon, active, to }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                active ? "bg-slate-800 text-white" : "text-slate-400 dark:text-slate-500 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider">CHANNELS</p>
            {isAdmin && (
              <button onClick={onNewChannel} title="New channel" className="text-slate-400 hover:text-white">
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex flex-col gap-0.5 mb-6">
            {channels.map((c) => (
              <div
                key={c.id}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeId === c.id ? "bg-slate-800 text-white" : "text-slate-400 dark:text-slate-500 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <button onClick={() => onSelect(c.id)} className="flex items-center gap-1.5 min-w-0 flex-1 text-left">
                  <Hash className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate">{c.label}</span>
                </button>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {c.unread > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => onManageChannel(c)}
                      title="Manage channel access"
                      className="opacity-0 group-hover:opacity-100 hover:text-white"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider mb-2">DIRECT MESSAGES</p>
          <div className="flex flex-col gap-0.5">
            {dms.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeId === c.id ? "bg-slate-800 text-white" : "text-slate-400 dark:text-slate-500 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <img src={c.avatar} alt={c.label} className="w-5 h-5 rounded-full object-cover" />
                {c.label}
                {c.unread > 0 && (
                  <span className="ml-auto bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-5 pt-3 flex flex-col gap-3 border-t border-slate-800">
        <div className="flex items-center justify-around text-slate-400 dark:text-slate-500">
          <button onClick={() => navigate("/profile")} className="flex items-center gap-1.5 text-xs hover:text-white">
            <User className="w-4 h-4" />
            Profile
          </button>
          <button onClick={() => navigate("/support")} className="flex items-center gap-1.5 text-xs hover:text-white">
            <HelpCircle className="w-4 h-4" />
            Help
          </button>
        </div>
      </div>
    </aside>
  );
}

function ChatHeader({ conversation, searchOpen, onToggleSearch, searchValue, onSearchChange }) {
  const isDm = conversation?.type === "dm";
  return (
    <header className="flex flex-col gap-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          {isDm ? (
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
              <img src={conversation.contact?.avatar} alt={conversation.label} className="w-full h-full object-cover" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              <Hash className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              {conversation?.label || "Select a conversation"}
              {isDm && conversation?.contact?.role && (
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-medium px-2 py-0.5 rounded-md">
                  {conversation.contact.role}
                </span>
              )}
            </p>
            {isDm && <p className="text-xs text-emerald-500">{conversation.contact?.status}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
          <button disabled title="Calling isn't available in this demo" className="cursor-not-allowed opacity-50">
            <Phone className="w-4.5 h-4.5" />
          </button>
          <button disabled title="Video calling isn't available in this demo" className="cursor-not-allowed opacity-50">
            <Video className="w-4.5 h-4.5" />
          </button>
          <span className="w-px h-5 bg-slate-200" />
          <button onClick={onToggleSearch} className={searchOpen ? "text-blue-600" : "hover:text-slate-700 dark:hover:text-slate-200"}>
            <Search className="w-4.5 h-4.5" />
          </button>
          <button disabled title="No additional actions yet" className="cursor-not-allowed opacity-50">
            <MoreVertical className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
      {searchOpen && (
        <div className="px-6 pb-3">
          <input
            autoFocus
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search in this conversation..."
            className="w-full text-sm bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 outline-none placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      )}
    </header>
  );
}

function MessageBubble({ message }) {
  return (
    <div className={`flex items-start gap-3 mb-6 max-w-xl ${message.isOwn ? "ml-auto flex-row-reverse" : ""}`}>
      {message.senderAvatar && (
        <img src={message.senderAvatar} alt={message.senderName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
      )}
      <div>
        <p className={`text-sm mb-1 ${message.isOwn ? "text-right" : ""}`}>
          {message.isOwn ? (
            <>
              <span className="text-xs text-slate-400 dark:text-slate-500 mr-2">{message.time}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{message.senderName}</span>
            </>
          ) : (
            <>
              <span className="font-semibold text-slate-900 dark:text-white">{message.senderName}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">{message.time}</span>
            </>
          )}
        </p>
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            message.isOwn ? "bg-blue-600 text-white rounded-tr-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm"
          }`}
        >
          {message.content}
        </div>
        {(message.attachments || []).length > 0 && (
          <div className="flex flex-col gap-1 mt-2">
            {message.attachments.map((a, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                {a.name || a.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MessageThread({ messages, filterQuery }) {
  const filtered = filterQuery
    ? messages.filter((m) => m.content?.toLowerCase().includes(filterQuery.toLowerCase()))
    : messages;
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      {messages.length === 0 ? (
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-10">No messages yet — say hello!</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-10">No messages match "{filterQuery}".</p>
      ) : (
        filtered.map((m) => <MessageBubble key={m.id} message={m} />)
      )}
    </div>
  );
}

const EMOJI_OPTIONS = ["😀", "😂", "👍", "🎉", "❤️", "🙏", "👏", "🔥"];

function MessageInput({ conversationLabel, onSend }) {
  const [value, setValue] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const inputRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const [pendingAttachment, setPendingAttachment] = useState(null);

  function submit() {
    if (!value.trim() && !pendingAttachment) return;
    onSend(value.trim(), pendingAttachment ? [pendingAttachment] : undefined);
    setValue("");
    setPendingAttachment(null);
  }

  function wrapSelection(marker) {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || "text";
    const next = value.slice(0, start) + marker + selected + marker + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => el.focus());
  }

  function insertAtCursor(text) {
    const el = inputRef.current;
    const pos = el?.selectionStart ?? value.length;
    const next = value.slice(0, pos) + text + value.slice(pos);
    setValue(next);
    requestAnimationFrame(() => el?.focus());
  }

  function handleFileChosen(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingAttachment({ name: file.name });
    e.target.value = "";
  }

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-4 flex-shrink-0">
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5">
        {pendingAttachment && (
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 mb-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="truncate">📎 {pendingAttachment.name}</span>
            <button onClick={() => setPendingAttachment(null)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 ml-2">
              Remove
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder={`Message ${conversationLabel || "..."}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full text-sm outline-none placeholder-slate-400 dark:placeholder-slate-500 mb-2 bg-transparent"
        />
        <div className="flex items-center justify-between">
          <div className="relative flex items-center gap-3 text-slate-400 dark:text-slate-500">
            <button title="Bold" onClick={() => wrapSelection("**")} className="hover:text-slate-600 dark:hover:text-slate-300">
              <Bold className="w-4 h-4" />
            </button>
            <button title="Italic" onClick={() => wrapSelection("_")} className="hover:text-slate-600 dark:hover:text-slate-300">
              <Italic className="w-4 h-4" />
            </button>
            <button title="Attach file" onClick={() => fileInputRef.current?.click()} className="hover:text-slate-600 dark:hover:text-slate-300">
              <Paperclip className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChosen} />
            <button title="Emoji" onClick={() => setEmojiOpen((v) => !v)} className="hover:text-slate-600 dark:hover:text-slate-300">
              <Smile className="w-4 h-4" />
            </button>
            <button title="Mention someone" onClick={() => insertAtCursor("@")} className="hover:text-slate-600 dark:hover:text-slate-300">
              <AtSign className="w-4 h-4" />
            </button>
            {emojiOpen && (
              <div className="absolute bottom-6 left-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-2 flex gap-1 z-10">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      insertAtCursor(emoji);
                      setEmojiOpen(false);
                    }}
                    className="text-lg hover:scale-110 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={submit} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg">
            Send
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfilePanel({ conversation }) {
  if (!conversation) return <aside className="w-72 h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex-shrink-0" />;
  const isDm = conversation.type === "dm";

  return (
    <aside className="w-72 h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex-shrink-0 overflow-y-auto p-6">
      {isDm && conversation.contact && (
        <div className="flex flex-col items-center text-center mb-6">
          <img src={conversation.contact.avatar} alt={conversation.contact.name} className="w-20 h-20 rounded-full object-cover mb-3" />
          <p className="text-base font-bold text-slate-900 dark:text-white">{conversation.contact.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{conversation.contact.role}</p>
        </div>
      )}

      <div className="mb-2">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Folder className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            Shared Files
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {(conversation.sharedFiles || []).length === 0 && <p className="text-xs text-slate-400 dark:text-slate-500">No files shared yet.</p>}
          {(conversation.sharedFiles || []).map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-50 text-red-500">
                <Folder className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{f.name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{f.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 mb-3">
          <Link2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          Shared Links
        </p>
        <div className="flex flex-col gap-2">
          {(conversation.sharedLinks || []).length === 0 && <p className="text-xs text-slate-400 dark:text-slate-500">No links shared yet.</p>}
          {(conversation.sharedLinks || []).map((l, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Link2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-blue-600 truncate">{l.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{l.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function MessagesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [channelModal, setChannelModal] = useState(null); // null | { mode: "create" } | { mode: "manage", channel }

  function refreshConversations() {
    messagesApi.listConversations().then((list) => {
      setConversations(list);
      if (list.length && !activeId) setActiveId(list[0].id);
    });
  }

  useEffect(() => {
    refreshConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleManageChannel(sidebarChannel) {
    let all = await messagesApi.listAllChannels();
    let full = all.find((c) => c.id === sidebarChannel.id) || sidebarChannel;
    setChannelModal({ mode: "manage", channel: full });
  }

  function handleChannelModalChanged() {
    setChannelModal(null);
    refreshConversations();
  }

  const loadConversation = useCallback(async (id) => {
    if (!id) return;
    let [details, msgs] = await Promise.all([messagesApi.getConversation(id), messagesApi.listMessages(id)]);
    setConversation(details);
    setMessages(msgs);
    await messagesApi.markRead(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }, []);

  useEffect(() => {
    loadConversation(activeId);
    setSearchOpen(false);
    setSearchValue("");
  }, [activeId, loadConversation]);

  async function handleSend(content, attachments) {
    if (!activeId) return;
    let message = await messagesApi.sendMessage(activeId, content, attachments);
    setMessages((prev) => [...prev, message]);
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex bg-slate-50 dark:bg-slate-950">
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        isAdmin={isAdmin}
        onNewChannel={() => setChannelModal({ mode: "create" })}
        onManageChannel={handleManageChannel}
      />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <ChatHeader
          conversation={conversation}
          searchOpen={searchOpen}
          onToggleSearch={() => setSearchOpen((v) => !v)}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        <MessageThread messages={messages} filterQuery={searchOpen ? searchValue : ""} />
        <MessageInput conversationLabel={conversation?.label} onSend={handleSend} />
      </div>
      <ProfilePanel conversation={conversation} />
      {channelModal && (
        <ManageChannelModal
          channel={channelModal.mode === "manage" ? channelModal.channel : null}
          onClose={() => setChannelModal(null)}
          onChanged={handleChannelModalChanged}
        />
      )}
    </div>
  );
}
