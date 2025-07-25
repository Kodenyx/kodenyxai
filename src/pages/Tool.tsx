import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Sparkles, Copy, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import EmailCaptureModal from "@/components/EmailCaptureModal";
import PaywallModal from "@/components/PaywallModal";
import { useUsageTracking } from "@/hooks/useUsageTracking";

interface RewriteResponse {
  rewritten_email: string;
  psychological_triggers: string[];
  structure_improvements: string[];
  questions?: string[];
}

const Tool = () => {
  const [emailContent, setEmailContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [makeover, setMakeover] = useState("");
  const [showMakeover, setShowMakeover] = useState(false);
  const [analysis, setAnalysis] = useState({
    psychologicalTriggers: [] as string[],
    structureImprovements: [] as string[],
    questions: [] as string[]
  });
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const {
    usageCount,
    email,
    isSubscribed,
    needsEmailCapture,
    needsPaywall,
    loading,
    incrementUsage,
    setUserEmail,
    createCheckoutSession,
    refreshUsageData
  } = useUsageTracking();

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  useEffect(() => {
    const subscription = searchParams.get('subscription');
    if (subscription === 'success') {
      toast({
        title: "Welcome to unlimited access! 🎉",
        description: "Your subscription is active. Enjoy unlimited email fixes!",
      });
      refreshUsageData();
    } else if (subscription === 'cancelled') {
      toast({
        title: "Subscription cancelled",
        description: "No worries! You can still use your remaining free uses.",
      });
    }
  }, [searchParams, toast, refreshUsageData]);

  const logToolUsage = async (originalEmail: string, transformedEmail: string, emailCategory: string = 'ai-rewritten') => {
    const userEmail = email || 'anonymous@example.com';
    
    try {
      console.log('Logging tool usage:', { userEmail, emailCategory, originalLength: originalEmail.length });
      
      const { data, error } = await supabase
        .from('tool_usage')
        .insert([{
          user_id: null,
          email_address: userEmail,
          original_email: originalEmail,
          transformed_email: transformedEmail,
          email_category: emailCategory
        }])
        .select();

      if (error) {
        console.error('Error logging tool usage:', error);
        await supabase
          .from('tool_usage')
          .insert([{
            user_id: null,
            email_address: userEmail,
            original_email: originalEmail.substring(0, 1000),
            transformed_email: transformedEmail.substring(0, 1000),
            email_category: emailCategory
          }]);
      } else {
        console.log('Tool usage logged successfully:', data);
      }
    } catch (error) {
      console.error('Failed to log tool usage:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check access control before processing
    if (needsEmailCapture) {
      setShowEmailModal(true);
      return;
    }
    
    if (needsPaywall) {
      setShowPaywallModal(true);
      return;
    }
    
    setIsSubmitting(true);

    try {
      console.log('Calling rewrite-email function...');
      
      const { data, error } = await supabase.functions.invoke('rewrite-email', {
        body: {
          emailContent: emailContent
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to rewrite email');
      }

      console.log('Function response:', data);
      
      setMakeover(data.rewritten_email);
      setAnalysis({
        psychologicalTriggers: data.psychological_triggers || [],
        structureImprovements: data.structure_improvements || [],
        questions: data.questions || []
      });
      setShowMakeover(true);
      
      // Increment usage count and log usage
      await incrementUsage(email || undefined);
      await logToolUsage(emailContent, data.rewritten_email, 'ai-rewritten');
      
      toast({
        title: "Fixes applied",
        description: "We handled the fix. You handle the final touch.",
      });
      
    } catch (error) {
      console.error('Error during email makeover:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setEmailContent("");
    setMakeover("");
    setShowMakeover(false);
    setAnalysis({ psychologicalTriggers: [], structureImprovements: [], questions: [] });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(makeover);
      toast({
        title: "Copied!",
        description: "Improved email copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      const textArea = document.createElement('textarea');
      textArea.value = makeover;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        toast({
          title: "Copied!",
          description: "Improved email copied to clipboard",
        });
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        toast({
          title: "Copy failed",
          description: "Unable to copy to clipboard. Please select and copy manually.",
          variant: "destructive",
        });
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const handleEmailSubmit = (submittedEmail: string) => {
    setUserEmail(submittedEmail);
    toast({
      title: "Email saved!",
      description: "You can now continue using the tool.",
    });
  };

  const handleSubscribe = () => {
    if (email) {
      createCheckoutSession(email);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3B1E5E' }}>Loading...</h2>
          <p style={{ color: '#89888E' }}>Preparing your email tool...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar />
      
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#3B1E5E' }}>
                Transform Your B2B Email{" "}
                <span style={{ color: '#E19013' }}>
                  in Under 3 Seconds
                </span>
              </h1>
              <p className="text-xl md:text-2xl max-w-4xl mx-auto" style={{ color: '#3B1E5E' }}>
                Paste your email below and watch our AI apply proven behavioral psychology 
                frameworks to make it more compelling and conversion-focused.
              </p>
              
              {/* Usage Status */}
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-4 bg-white/80 rounded-full px-6 py-3">
                  <BarChart3 className="w-5 h-5" style={{ color: '#E19013' }} />
                  <span style={{ color: '#3B1E5E' }}>
                    {isSubscribed ? (
                      <strong>Unlimited Access</strong>
                    ) : (
                      <>Uses: <strong>{usageCount}</strong> / 5 free</>
                    )}
                  </span>
                  {email && (
                    <span className="text-sm text-gray-600">• {email}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#3B1E5E' }}>Your Original Email</h3>
                  <Textarea 
                    placeholder="Paste your email content here..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    required
                    className="min-h-80 text-base border-2 rounded-xl focus:ring-2 border-gray-300 focus:border-gray-400"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold" style={{ color: '#3B1E5E' }}>Your Improved Email</h3>
                    {showMakeover && (
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 border-gray-300 text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                    )}
                  </div>
                  <div className={`min-h-80 border-2 rounded-xl p-4 ${showMakeover ? '' : 'flex items-center justify-center'}`} 
                       style={{ 
                         backgroundColor: showMakeover ? '#ffffff' : '#f9fafb', 
                         borderColor: '#d1d5db' 
                       }}>
                    {showMakeover ? (
                      <div className="whitespace-pre-line text-sm leading-relaxed" style={{ color: '#3B1E5E' }}>
                        {makeover}
                      </div>
                    ) : (
                      <p className="text-center" style={{ color: '#89888E' }}>
                        Your enhanced email will appear here...
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {!showMakeover && (
                <form onSubmit={handleSubmit}>
                  <div className="text-center">
                    <Button 
                      type="submit"
                      disabled={isSubmitting || !emailContent.trim()}
                      className="text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105 hover:opacity-90"
                      style={{ backgroundColor: '#E19013' }}
                    >
                      {isSubmitting ? (
                        "Fixing Your Email..."
                      ) : (
                        <>
                          <Sparkles className="mr-3 h-6 w-6" />
                          Fix My Email
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {showMakeover && (
                <>
                  <div className="rounded-2xl p-8 mt-12" style={{ backgroundColor: '#f9fafb' }}>
                    <h2 className="text-3xl font-bold mb-8" style={{ color: '#3B1E5E' }}>What Changed & Why</h2>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-6" style={{ color: '#E19013' }}>Psychological Triggers Applied:</h3>
                        <div className="space-y-3">
                          {analysis.psychologicalTriggers.map((trigger, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#E19013' }} />
                              <span style={{ color: '#3B1E5E' }}>{trigger}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-6" style={{ color: '#E19013' }}>Structure Improvements:</h3>
                        <div className="space-y-3">
                          {analysis.structureImprovements.map((improvement, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#E19013' }} />
                              <span style={{ color: '#3B1E5E' }}>{improvement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {analysis.questions && analysis.questions.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4" style={{ color: '#E19013' }}>Questions for Better Results:</h3>
                        <div className="space-y-2">
                          {analysis.questions.map((question, index) => (
                            <div key={index} className="p-3 rounded-lg" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                              {question}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                      className="border-2 py-3 px-8 rounded-full border-gray-300 text-gray-600"
                    >
                      Enhance Another Email
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onEmailSubmit={handleEmailSubmit}
        usageCount={usageCount}
      />

      <PaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        onSubscribe={handleSubscribe}
        usageCount={usageCount}
      />
    </div>
  );
};

export default Tool;
