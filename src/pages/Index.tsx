import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import globeImage from "@/assets/globe.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Globe Icon & Auth Links */}
        <div className="flex flex-col items-center space-y-6">
          <div className="animate-spin-slow" style={{ transformStyle: 'preserve-3d' }}>
            <img src={globeImage} alt="Earth globe" className="w-60 h-60 object-contain" />
          </div>
          <div className="flex flex-col items-center space-y-4 text-primary-foreground">
            <button className="text-5xl font-medium hover:underline">Check In (Log In)</button>
            <button className="text-3xl opacity-80 hover:underline">Purchase Flight (Create Account)</button>
          </div>
        </div>

        {/* Social Login Options */}
        <div className="mt-12 flex flex-col items-center space-y-4">
          <p className="text-xl text-muted-foreground">Continue with</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" size="lg" className="px-6 py-4 h-auto bg-white">
              <FcGoogle size={32} />
            </Button>
            <Button variant="outline" size="lg" className="px-6 py-4 h-auto bg-white">
              <FaInstagram size={32} className="text-pink-500" />
            </Button>
            <Button variant="outline" size="lg" className="px-6 py-4 h-auto bg-white">
              <FaFacebook size={32} className="text-blue-600" />
            </Button>
            <Button variant="outline" size="lg" className="px-6 py-4 h-auto bg-white">
              <FaTiktok size={32} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
