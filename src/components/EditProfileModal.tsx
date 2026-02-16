import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Camera, MapPin } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { airports } from "@/data/flights";

interface ProfileData {
  name: string;
  occupation: string;
  hobbies: string[];
  interestedIn: string[];
  favoriteFood: string[];
  profilePhoto?: string;
  currentAirport?: string;
}

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: ProfileData;
  onSave: (data: ProfileData) => void;
}

const EditProfileModal = ({ open, onOpenChange, profileData, onSave }: EditProfileModalProps) => {
  const [formData, setFormData] = useState<ProfileData>(profileData);
  const [newHobby, setNewHobby] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newFood, setNewFood] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = (field: "hobbies" | "interestedIn" | "favoriteFood", value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter("");
    }
  };

  const removeItem = (field: "hobbies" | "interestedIn" | "favoriteFood", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary-foreground">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-24 h-24">
              <AvatarImage src={formData.profilePhoto} alt="Profile" />
              <AvatarFallback className="text-2xl font-bold">
                {formData.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Camera size={16} />
              Browse Photo
            </Button>
          </div>

          <div>
            <Label className="text-primary-foreground">Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 bg-background/50 border-border text-primary-foreground"
            />
          </div>
          
          <div>
            <Label className="text-primary-foreground">Occupation</Label>
            <Input
              value={formData.occupation}
              onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
              className="mt-1 bg-background/50 border-border text-primary-foreground"
            />
          </div>

          {/* Current Airport Location */}
          <div>
            <Label className="text-primary-foreground flex items-center gap-2">
              <MapPin size={16} /> Current Airport Location
            </Label>
            <Select
              value={formData.currentAirport || ""}
              onValueChange={(value) => setFormData(prev => ({ ...prev, currentAirport: value }))}
            >
              <SelectTrigger className="mt-1 bg-background/50 border-border text-primary-foreground">
                <SelectValue placeholder="Select your airport" />
              </SelectTrigger>
              <SelectContent className="bg-card text-card-foreground border-border z-50 max-h-60">
                <ScrollArea className="h-60">
                  {airports.filter(a => a !== "All Airports").map((airport) => (
                    <SelectItem key={airport} value={airport}>
                      {airport}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-primary-foreground">Hobbies</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.hobbies.map((hobby, i) => (
                <span key={i} className="bg-accent/30 text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {hobby}
                  <button onClick={() => removeItem("hobbies", i)}><X size={14} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                placeholder="Add hobby"
                className="bg-background/50 border-border text-primary-foreground"
                onKeyDown={(e) => e.key === "Enter" && addItem("hobbies", newHobby, setNewHobby)}
              />
              <Button onClick={() => addItem("hobbies", newHobby, setNewHobby)} variant="outline" size="sm">Add</Button>
            </div>
          </div>
          
          <div>
            <Label className="text-primary-foreground">Interested In</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.interestedIn.map((interest, i) => (
                <span key={i} className="bg-accent/30 text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {interest}
                  <button onClick={() => removeItem("interestedIn", i)}><X size={14} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add interest"
                className="bg-background/50 border-border text-primary-foreground"
                onKeyDown={(e) => e.key === "Enter" && addItem("interestedIn", newInterest, setNewInterest)}
              />
              <Button onClick={() => addItem("interestedIn", newInterest, setNewInterest)} variant="outline" size="sm">Add</Button>
            </div>
          </div>
          
          <div>
            <Label className="text-primary-foreground">Favorite Food</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.favoriteFood.map((food, i) => (
                <span key={i} className="bg-accent/30 text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {food}
                  <button onClick={() => removeItem("favoriteFood", i)}><X size={14} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                value={newFood}
                onChange={(e) => setNewFood(e.target.value)}
                placeholder="Add favorite food"
                className="bg-background/50 border-border text-primary-foreground"
                onKeyDown={(e) => e.key === "Enter" && addItem("favoriteFood", newFood, setNewFood)}
              />
              <Button onClick={() => addItem("favoriteFood", newFood, setNewFood)} variant="outline" size="sm">Add</Button>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">Save Changes</Button>
            <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
