import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { 
  ChevronRight, 
  Search, 
  RefreshCw, 
  MessageSquare, 
  Edit, 
  Send, 
  Clock, 
  Users, 
  ShieldCheck, 
  Building2, 
  FileBadge, 
  GraduationCap, 
  Check, 
  MoreVertical,
  Paperclip,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { messageService, MessageItem, ConversationThread } from "../../services/messageService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export function OfficerMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationThread[]>([]);
  const [activeChat, setActiveChat] = useState<ConversationThread | null>(null);
  const [chatMessages, setChatMessages] = useState<MessageItem[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await messageService.getConversations();
      setConversations(res.conversations || []);
      if (res.conversations && res.conversations.length > 0 && !activeChat) {
        setActiveChat(res.conversations[0]);
      }
    } catch {
      toast.error("Failed to load department conversations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeChat) {
      setChatLoading(true);
      messageService.getMyMessages({
        department: user?.department || "Library",
        studentId: activeChat.user?._id || activeChat.id,
      })
        .then((res) => {
          setChatMessages(res.messages || []);
        })
        .catch(() => {
          toast.error("Failed to load chat history.");
        })
        .finally(() => {
          setChatLoading(false);
        });
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    setIsSending(true);
    try {
      const res = await messageService.sendMessage({
        recipientId: activeChat.user?._id,
        department: user?.department || "Library",
        subject: `Response from ${user?.name || "Officer"} (${user?.department || "Desk"})`,
        message: messageInput.trim(),
      });

      setChatMessages((prev) => [...prev, res.data]);
      setMessageInput("");
      toast.success("Message sent to student.");
    } catch (err: any) {
      toast.error(err.message || "Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    (c.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.user?.studentId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.lastMessage || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 pb-20 md:pb-0 h-[calc(100vh-5rem)] flex flex-col animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <Link to="/officer" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">{user?.department || "Department"} Inquiries</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Communication Center
            {totalUnread > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                {totalUnread} Unread
              </span>
            )}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={fetchConversations} className="bg-white border-slate-200 shadow-sm px-3 flex-1 sm:flex-none">
            <RefreshCw className={`w-4 h-4 sm:mr-2 text-slate-500 ${loading ? "animate-spin" : ""}`} /> 
            <span className="hidden sm:inline text-slate-600">Refresh</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unread Inquiries</span>
          <span className="text-xl font-bold text-blue-600">{totalUnread}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Threads</span>
          <span className="text-xl font-bold text-slate-900">{conversations.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</span>
          <span className="text-sm font-bold text-indigo-900 truncate">{user?.department || "General"}</span>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Status</span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Live Connected</span>
        </div>
      </div>

      {/* Main Communication Interface */}
      <div className="flex flex-1 overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm">
        {/* LEFT PANEL: Conversation List */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-200 shrink-0 bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students or messages..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-xs">Loading conversations...</p>
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const isSelected = activeChat?.id === conv.id;
                const studentName = conv.user?.name || "Student";
                const initials = studentName.split(" ").map((n) => n[0]).join("").slice(0, 2);
                return (
                  <div 
                    key={conv.id}
                    onClick={() => setActiveChat(conv)}
                    className={`p-4 cursor-pointer transition-all hover:bg-slate-100 relative ${
                      isSelected ? "bg-blue-50/60 border-l-4 border-l-blue-600" : "border-l-4 border-l-transparent bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs bg-blue-100 text-blue-700 shrink-0 shadow-sm">
                          {initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className={`text-sm truncate ${conv.unreadCount > 0 ? "font-bold text-slate-900" : "font-semibold text-slate-800"}`}>
                            {studentName}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate">
                            {conv.user?.studentId ? `${conv.user.studentId} • ` : ""}{conv.department}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    
                    <div className="pl-13 mt-1 flex justify-between items-center">
                      <p className={`text-xs truncate max-w-[200px] ${conv.unreadCount > 0 ? "text-slate-900 font-semibold" : "text-slate-500"}`}>
                        {conv.lastMessage}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No Conversations</p>
                <p className="text-xs text-slate-400 mt-1">Student inquiries directed to {user?.department || "your desk"} will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* CENTER PANEL: Chat Window */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {!activeChat ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3 text-blue-600">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Select a Conversation</h3>
              <p className="text-xs text-slate-500 max-w-sm">Choose a conversation from the left to view messages and respond to students in real-time.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {(activeChat.user?.name || "Student").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      {activeChat.user?.name || "Student"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {activeChat.user?.studentId ? `${activeChat.user.studentId} • ` : ""}{activeChat.department} Clearance Desk
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                {chatLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : chatMessages.length > 0 ? (
                  chatMessages.map((msg) => {
                    const isOfficer = msg.senderRole === "officer" || msg.senderRole === "registrar";
                    return (
                      <div key={msg._id} className={`flex flex-col ${isOfficer ? "items-end" : "items-start"}`}>
                        <div className={`max-w-md p-4 rounded-2xl text-sm shadow-sm ${
                          isOfficer 
                            ? "bg-blue-600 text-white rounded-br-none" 
                            : "bg-white border border-slate-200 text-slate-900 rounded-bl-none"
                        }`}>
                          <p className="text-[10px] font-semibold mb-1 opacity-80">
                            {msg.senderName} ({msg.senderRole})
                          </p>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-12">
                    <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No messages yet</p>
                    <p className="text-xs text-slate-400">Send an official reply to the student below.</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer Area */}
              <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={`Reply to ${activeChat.user?.name || "student"}...`}
                    className="h-12 text-sm bg-slate-50 border-slate-300"
                    required
                  />
                  <Button 
                    type="submit" 
                    isLoading={isSending} 
                    className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold shrink-0"
                  >
                    <Send className="w-4 h-4 mr-2" /> Reply
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
