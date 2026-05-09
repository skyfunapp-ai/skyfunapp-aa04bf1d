import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DeleteAccountButton = () => {
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;
      toast({ title: "Account deleted", description: "Your account and data have been permanently removed." });
      await signOut();
      navigate("/", { replace: true });
    } catch (e) {
      toast({
        title: "Couldn't delete account",
        description: (e as Error).message ?? "Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium"
        >
          <Trash2 size={16} />
          Delete Account
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes your profile, messages, connections, referrals, Skoin balance, and uploaded photos. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Delete permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountButton;
