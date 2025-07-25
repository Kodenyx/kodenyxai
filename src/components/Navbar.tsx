
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === '/tool') {
      // If we're on the tool page, reset the tool by reloading the page
      window.location.reload();
    } else {
      // If we're on any other page, navigate to the tool page
      navigate('/tool');
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        >
          <img 
            src="/lovable-uploads/f0914198-3ee9-4b3b-968e-4dcac9907e0d.png" 
            alt="Fix My Email Logo" 
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-white">Fix My Email</span>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                {/* Empty - no navigation items */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
