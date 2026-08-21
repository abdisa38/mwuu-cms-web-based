import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { publicService, FaqCategory } from "../../services/publicService";

export function FaqPage() {
  const [faqs, setFaqs] = useState<FaqCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "0-0": true, "1-0": true });

  useEffect(() => {
    publicService.getFaqs()
      .then((res) => {
        if (res.faqs) {
          setFaqs(res.faqs);
        }
      })
      .catch((err) => {
        console.error("Failed to load FAQs:", err);
      });
  }, []);

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredCategories = faqs.map((cat) => {
    const matchingQuestions = cat.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...cat,
      questions: matchingQuestions,
    };
  }).filter((cat) => cat.questions.length > 0);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-50 w-full animate-in fade-in duration-300">
      {/* Hero Header */}
      <section className="w-full pt-16 pb-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-900/50 px-4 py-1.5 text-xs text-blue-300 mb-6 backdrop-blur-sm">
            <HelpCircle className="w-4 h-4" />
            Knowledge Base & Frequently Asked Questions
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            How can we help you?
          </h1>
          <p className="text-slate-300 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Find answers to common questions about Madda Walabu University digital clearance, department requirements, and certificates.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clearance questions (e.g. library, graduation, certificates)..."
              className="w-full pl-12 pr-4 py-4 bg-white text-slate-900 placeholder-slate-400 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg text-base"
            />
          </div>
        </div>
      </section>

      {/* FAQs List Section */}
      <section className="container mx-auto px-4 max-w-4xl py-12 flex-1">
        <div className="space-y-10">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, catIdx) => (
              <div key={catIdx} className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  {category.category}
                </h2>

                <div className="space-y-3">
                  {category.questions.map((item, qIdx) => {
                    const itemKey = `${catIdx}-${qIdx}`;
                    const isOpen = Boolean(openItems[itemKey]);

                    return (
                      <div
                        key={qIdx}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:border-blue-300"
                      >
                        <button
                          onClick={() => toggleItem(itemKey)}
                          className="w-full p-5 text-left flex justify-between items-center gap-4 bg-white hover:bg-slate-50/50 transition-colors"
                        >
                          <span className="font-semibold text-slate-900 text-base">
                            {item.q}
                          </span>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180 bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                          }`}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50/30 animate-in fade-in slide-in-from-top-1">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No matching questions found</h3>
              <p className="text-slate-500 max-w-md mx-auto text-sm mb-6">
                We couldn't find an answer matching "{searchQuery}". Try searching with different keywords or contact our support team.
              </p>
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {/* Contact Support Banner */}
        <div className="mt-16 bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="relative z-10 max-w-xl">
            <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              If you have specific department inquiries, library fines, or require assistance with your student ID, contact the Registrar support desk directly.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link to="/login" className="w-full sm:w-auto">
              <Button className="w-full bg-white text-blue-900 hover:bg-slate-100 font-semibold">
                <MessageSquare className="w-4 h-4 mr-2" /> Log In for Inquiries
              </Button>
            </Link>
            <Link to="/verify" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full border-blue-300 text-white hover:bg-blue-800">
                <ShieldCheck className="w-4 h-4 mr-2" /> Verify Certificate
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
