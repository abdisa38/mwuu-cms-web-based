import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { 
  MessageSquare, 
  Send, 
  Search, 
  ChevronRight, 
  User, 
  Building,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { messageService, MessageItem } from "../../services/messageService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export function MessagesCenter() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRecipient, setActiveRecipient] = useState("Registrar Support");
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await messageService.getMyMessages();
      setMessages(res.messages);
    } catch {
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const res = await messageService.sendMessage({
        subject: `Message from ${user?.name || "Student"}`,
        message: newMessage,
      });
      setMessages(prev => [res.data, ...prev]);
      setNewMessage("");
      toast.success("Message sent successfully.");
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

        <Button variant="outline" onClick={fetchMessages} className="bg-white">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[550px]">
        {/* Left contacts list */}
        <div className="border-r border-slate-200 p-4 space-y-2 bg-slate-50/50">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
            University Contacts
          </div>
          {['Registrar Office', 'Library Clearance Desk', 'Dormitory Administration', 'Cafeteria Manager'].map((c, i) => (
            <div 
              key={i}
              onClick={() => setActiveRecipient(c)}
              className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-colors ${
                activeRecipient === c ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                activeRecipient === c ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-600'
              }`}>
                {c.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div className="truncate">
                <p className="font-semibold text-sm truncate">{c}</p>
                <p className={`text-xs truncate ${activeRecipient === c ? 'text-blue-100' : 'text-slate-400'}`}>Online for inquiries</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Conversation Stream */}
        <div className="md:col-span-2 flex flex-col justify-between p-6">
          <div className="border-b border-slate-200 pb-4 mb-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{activeRecipient}</h3>
              <p className="text-xs text-slate-500">Official Madda Walabu University Channel</p>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isMe = msg.sender === user?._id || msg.sender === user?.id;
                return (
                  <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-md p-4 rounded-2xl text-sm shadow-sm ${
                      isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-900 rounded-bl-none'
                    }`}>
                      <p className="font-semibold text-xs mb-1 opacity-80">{msg.senderName} ({msg.senderRole})</p>
                      <p className="leading-relaxed">{msg.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
                <p className="font-medium text-slate-700">No messages yet</p>
                <p className="text-xs text-slate-500">Send an inquiry to university officers or the registrar below.</p>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-200 pt-4">
            <Input 
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder={`Write a message to ${activeRecipient}...`}
              className="h-12 text-base"
              required
            />
            <Button type="submit" isLoading={isSending} className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white">
              <Send className="w-4 h-4 mr-2" /> Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
