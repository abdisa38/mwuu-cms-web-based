import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { 
  MessageSquare, 
  Send, 
  ChevronRight, 
  Building,
  RefreshCw,
  Clock
} from "lucide-react";
import { messageService, MessageItem } from "../../services/messageService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export interface ContactChannel {
  id: string; // Used for department filtering in DB
  title: string;
  subtitle: string;
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  { id: "Registrar", title: "Registrar Office", subtitle: "Clearance & Certificates Desk" },
  { id: "Library", title: "Library Clearance Desk", subtitle: "Book returns & Fines" },
  { id: "Dormitory", title: "Dormitory Administration", subtitle: "Room inspection & Keys" },
  { id: "Cafeteria", title: "Cafeteria Manager", subtitle: "Meal cards & Cafeteria dues" },
  { id: "Bookstore", title: "Bookstore Desk", subtitle: "Course materials" },
  { id: "Department Head", title: "Academic Department Head", subtitle: "Academic clearance sign-off" },
];

export function MessagesCenter() {
  const { user } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState<ContactChannel>(CONTACT_CHANNELS[0]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchMessages = async (deptId: string) => {
    setLoading(true);
    try {
      const res = await messageService.getMyMessages({ department: deptId });
      setMessages(res.messages || []);
    } catch {
      toast.error("Failed to load channel messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(selectedChannel.id);
  }, [selectedChannel]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const res = await messageService.sendMessage({
        department: selectedChannel.id,
        subject: `Inquiry from ${user?.name || "Student"}`,
        message: newMessage.trim(),
      });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
      toast.success(`Message sent to ${selectedChannel.title}.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <Link to="/student" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">Messages</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Communication & Inquiries</h1>
        </div>

        <Button variant="outline" onClick={() => fetchMessages(selectedChannel.id)} className="bg-white">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[580px]">
        {/* Left Contacts Channel List */}
        <div className="border-r border-slate-200 p-4 space-y-2 bg-slate-50/50">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
            University Clearances Desks
          </div>
          {CONTACT_CHANNELS.map((channel) => {
            const isSelected = selectedChannel.id === channel.id;
            return (
              <div 
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`p-3.5 rounded-2xl cursor-pointer flex items-center gap-3 transition-all ${
                  isSelected 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                    : "hover:bg-slate-100 text-slate-700 bg-white border border-slate-100"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isSelected ? "bg-white text-blue-600 shadow-sm" : "bg-slate-100 text-slate-600"
                }`}>
                  <Building className="w-5 h-5" />
                </div>
                <div className="truncate min-w-0">
                  <p className="font-semibold text-sm truncate">{channel.title}</p>
                  <p className={`text-xs truncate ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                    {channel.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Conversation Stream for Selected Channel */}
        <div className="md:col-span-2 flex flex-col justify-between p-6 bg-white">
          <div className="border-b border-slate-200 pb-4 mb-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                {selectedChannel.title}
              </h3>
              <p className="text-xs text-slate-500">
                Official Madda Walabu University Channel • {selectedChannel.subtitle}
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">
              {messages.length} message(s)
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 min-h-[300px] max-h-[400px]">
            {loading ? (
              <div className="h-full flex items-center justify-center py-16 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : messages.length > 0 ? (
              messages.map((msg) => {
                const senderId = typeof msg.sender === "object" ? msg.sender?._id : msg.sender;
                const isMe = senderId === user?._id || senderId === user?.id || msg.senderRole === "student";
                return (
                  <div key={msg._id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className={`max-w-md p-4 rounded-2xl text-sm shadow-sm ${
                      isMe 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200"
                    }`}>
                      <p className="font-semibold text-xs mb-1 opacity-85">
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
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-16">
                <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
                <p className="font-semibold text-slate-700">No messages in {selectedChannel.title}</p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Send your specific inquiry regarding clearance or requirements to this office below.
                </p>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-200 pt-4">
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Write a message to ${selectedChannel.title}...`}
              className="h-12 text-sm bg-slate-50 border-slate-300"
              required
            />
            <Button 
              type="submit" 
              isLoading={isSending} 
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold shrink-0"
            >
              <Send className="w-4 h-4 mr-2" /> Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
