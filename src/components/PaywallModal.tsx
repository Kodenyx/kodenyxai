
import { Button } from "@/components/ui/button";
import { CreditCard, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  usageCount: number;
}

const PaywallModal = ({ 
  isOpen, 
  onClose, 
  onSubscribe, 
  usageCount 
}: PaywallModalProps) => {
  const features = [
    "Unlimited email fixes",
    "Advanced psychological triggers",
    "Priority support",
    "Custom frameworks",
    "Analytics dashboard"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0 p-0 bg-transparent shadow-none">
        <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#0D4049' }}>
          <DialogHeader className="p-8 pb-4">
            <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#E19013' }}>
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-center text-3xl font-bold text-white mb-2">
              You've hit your free limit!
            </DialogTitle>
            <DialogDescription className="text-center text-lg" style={{ color: '#A9D6D4' }}>
              You've used the tool {usageCount} times. Subscribe to unlock unlimited access and premium features.
            </DialogDescription>
          </DialogHeader>

          <div className="px-8 pb-8">
            <div className="bg-white/10 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-white">$19.99</div>
                <div className="text-sm" style={{ color: '#A9D6D4' }}>per month</div>
              </div>
              
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={onSubscribe}
              className="w-full text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105 hover:opacity-90 border-0"
              style={{ backgroundColor: '#E19013' }}
            >
              Subscribe Now
            </Button>

            <p className="text-center text-sm mt-4" style={{ color: '#A9D6D4' }}>
              Cancel anytime. No commitments.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallModal;
