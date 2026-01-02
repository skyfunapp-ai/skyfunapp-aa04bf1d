import HeaderMinimal from "@/components/HeaderMinimal";
import BottomNav from "@/components/BottomNav";
import { Search } from "lucide-react";

const SearchPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderMinimal />
      
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-20 px-4">
        <Search size={64} className="text-primary-foreground/50 mb-4" />
        <h1 className="text-2xl font-bold text-primary-foreground">Search</h1>
        <p className="text-primary-foreground/70 mt-2">Find new connections</p>
      </main>
      
      <BottomNav activePage="search" />
    </div>
  );
};

export default SearchPage;
