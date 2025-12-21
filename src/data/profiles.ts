import profile1 from "@/assets/profile-1.jpg";
import profile2 from "@/assets/profile-2.jpg";
import profile3 from "@/assets/profile-3.jpg";
import profile4 from "@/assets/profile-4.jpg";
import { Profile } from "@/types/profile";

export const profiles: Profile[] = [
  {
    id: "1",
    name: "Emma",
    age: 26,
    bio: "Adventure seeker & coffee enthusiast ☕ Love hiking, photography, and spontaneous road trips. Looking for someone to explore the world with!",
    location: "San Francisco, CA",
    image: profile1,
    interests: ["Photography", "Hiking", "Travel", "Coffee"],
    distance: "2 miles away",
  },
  {
    id: "2",
    name: "James",
    age: 28,
    bio: "Software engineer by day, amateur chef by night 🍳 Passionate about good music, great food, and meaningful conversations.",
    location: "New York, NY",
    image: profile2,
    interests: ["Cooking", "Music", "Tech", "Reading"],
    distance: "5 miles away",
  },
  {
    id: "3",
    name: "Sofia",
    age: 24,
    bio: "Artist & dreamer 🎨 Finding beauty in everyday moments. Let's grab coffee and talk about life, art, and everything in between.",
    location: "Los Angeles, CA",
    image: profile3,
    interests: ["Art", "Yoga", "Nature", "Movies"],
    distance: "3 miles away",
  },
  {
    id: "4",
    name: "Michael",
    age: 30,
    bio: "Fitness enthusiast & nature lover 🏃‍♂️ Training for my next marathon while enjoying the simple things in life. Looking for a genuine connection.",
    location: "Austin, TX",
    image: profile4,
    interests: ["Fitness", "Running", "Outdoors", "Dogs"],
    distance: "8 miles away",
  },
];
