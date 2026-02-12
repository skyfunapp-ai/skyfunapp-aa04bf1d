export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departure: string;
  arrival: string;
  price: string;
}

export const airports = [
  "All Airports",
  "ATL - Atlanta",
  "LAX - Los Angeles",
  "ORD - Chicago O'Hare",
  "DFW - Dallas/Fort Worth",
  "DEN - Denver",
  "JFK - New York JFK",
  "SFO - San Francisco",
  "SEA - Seattle",
  "LAS - Las Vegas",
  "MCO - Orlando",
  "MIA - Miami",
  "LHR - London Heathrow",
  "CDG - Paris Charles de Gaulle",
  "NRT - Tokyo Narita",
  "DXB - Dubai",
  "SIN - Singapore Changi",
  "HKG - Hong Kong",
  "SYD - Sydney",
  "GRU - São Paulo",
  "JNB - Johannesburg",
  "ICN - Seoul Incheon",
  "BKK - Bangkok",
  "IST - Istanbul",
  "FRA - Frankfurt",
  "AMS - Amsterdam",
  "DEL - New Delhi",
  "PEK - Beijing",
  "MEX - Mexico City",
  "YYZ - Toronto Pearson",
  "FCO - Rome Fiumicino",
];

export const flights: Flight[] = [
  { id: "1", airline: "Delta", flightNumber: "DL 402", from: "Atlanta", fromCode: "ATL", to: "London Heathrow", toCode: "LHR", departure: "08:30 AM", arrival: "10:45 PM", price: "$489" },
  { id: "2", airline: "United", flightNumber: "UA 917", from: "San Francisco", fromCode: "SFO", to: "Tokyo Narita", toCode: "NRT", departure: "11:15 AM", arrival: "03:30 PM+1", price: "$712" },
  { id: "3", airline: "American", flightNumber: "AA 100", from: "New York JFK", fromCode: "JFK", to: "London Heathrow", toCode: "LHR", departure: "07:00 PM", arrival: "07:05 AM+1", price: "$534" },
  { id: "4", airline: "Emirates", flightNumber: "EK 203", from: "New York JFK", fromCode: "JFK", to: "Dubai", toCode: "DXB", departure: "11:00 PM", arrival: "07:15 PM+1", price: "$879" },
  { id: "5", airline: "Singapore Air", flightNumber: "SQ 321", from: "Singapore Changi", fromCode: "SIN", to: "London Heathrow", toCode: "LHR", departure: "09:25 AM", arrival: "04:20 PM", price: "$645" },
  { id: "6", airline: "Lufthansa", flightNumber: "LH 456", from: "Frankfurt", fromCode: "FRA", to: "Chicago O'Hare", toCode: "ORD", departure: "01:30 PM", arrival: "04:15 PM", price: "$523" },
  { id: "7", airline: "Air France", flightNumber: "AF 009", from: "Paris Charles de Gaulle", fromCode: "CDG", to: "Miami", toCode: "MIA", departure: "10:20 AM", arrival: "02:45 PM", price: "$467" },
  { id: "8", airline: "Qantas", flightNumber: "QF 12", from: "Sydney", fromCode: "SYD", to: "Los Angeles", toCode: "LAX", departure: "10:10 AM", arrival: "06:55 AM", price: "$892" },
  { id: "9", airline: "Korean Air", flightNumber: "KE 018", from: "Seoul Incheon", fromCode: "ICN", to: "San Francisco", toCode: "SFO", departure: "05:30 PM", arrival: "11:20 AM", price: "$678" },
  { id: "10", airline: "LATAM", flightNumber: "LA 800", from: "São Paulo", fromCode: "GRU", to: "Miami", toCode: "MIA", departure: "09:00 PM", arrival: "05:15 AM+1", price: "$398" },
  { id: "11", airline: "Turkish Air", flightNumber: "TK 001", from: "Istanbul", fromCode: "IST", to: "New York JFK", toCode: "JFK", departure: "07:45 AM", arrival: "11:30 AM", price: "$556" },
  { id: "12", airline: "KLM", flightNumber: "KL 601", from: "Amsterdam", fromCode: "AMS", to: "Toronto Pearson", toCode: "YYZ", departure: "11:00 AM", arrival: "01:20 PM", price: "$445" },
  { id: "13", airline: "Thai Airways", flightNumber: "TG 971", from: "Bangkok", fromCode: "BKK", to: "London Heathrow", toCode: "LHR", departure: "12:15 AM", arrival: "06:30 AM", price: "$589" },
  { id: "14", airline: "Air India", flightNumber: "AI 101", from: "New Delhi", fromCode: "DEL", to: "New York JFK", toCode: "JFK", departure: "02:00 AM", arrival: "07:30 AM", price: "$623" },
  { id: "15", airline: "Cathay Pacific", flightNumber: "CX 840", from: "Hong Kong", fromCode: "HKG", to: "Los Angeles", toCode: "LAX", departure: "01:00 AM", arrival: "09:30 PM-1", price: "$734" },
];

export interface AppUser {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "away";
  avatar: string;
  photo: string;
  bio: string;
}

export const appUsers: AppUser[] = [
  { id: "1", name: "Cynthia-Marie Smith", location: "Atlanta, GA", status: "online", avatar: "CS", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face", bio: "Business owner & travel enthusiast" },
  { id: "2", name: "Marcus Johnson", location: "New York, NY", status: "online", avatar: "MJ", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", bio: "Photographer exploring the world" },
  { id: "3", name: "Aisha Williams", location: "Los Angeles, CA", status: "away", avatar: "AW", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", bio: "Yoga instructor & foodie" },
  { id: "4", name: "David Chen", location: "San Francisco, CA", status: "online", avatar: "DC", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", bio: "Tech entrepreneur & hiker" },
  { id: "5", name: "Priya Patel", location: "Chicago, IL", status: "offline", avatar: "PP", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face", bio: "Chef & culinary blogger" },
  { id: "6", name: "James O'Brien", location: "London, UK", status: "online", avatar: "JO", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face", bio: "Musician & world traveler" },
  { id: "7", name: "Sofia Rodriguez", location: "Miami, FL", status: "away", avatar: "SR", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face", bio: "Marine biologist & diver" },
  { id: "8", name: "Kenji Tanaka", location: "Tokyo, Japan", status: "online", avatar: "KT", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face", bio: "Architect & design lover" },
  { id: "9", name: "Fatima Al-Hassan", location: "Dubai, UAE", status: "online", avatar: "FA", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face", bio: "Fashion designer & art collector" },
  { id: "10", name: "Lucas Müller", location: "Frankfurt, Germany", status: "offline", avatar: "LM", photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face", bio: "Engineer & cycling enthusiast" },
  { id: "11", name: "Amara Okafor", location: "Johannesburg, SA", status: "online", avatar: "AO", photo: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face", bio: "Environmental activist & writer" },
  { id: "12", name: "Elena Petrov", location: "Paris, France", status: "away", avatar: "EP", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face", bio: "Gallery curator & sommelier" },
  { id: "13", name: "Raj Sharma", location: "New Delhi, India", status: "online", avatar: "RS", photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face", bio: "Software developer & cricket fan" },
  { id: "14", name: "Olivia Thompson", location: "Sydney, Australia", status: "online", avatar: "OT", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face", bio: "Surfer & wildlife photographer" },
  { id: "15", name: "Carlos Mendes", location: "São Paulo, Brazil", status: "offline", avatar: "CM", photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=face", bio: "Music producer & DJ" },
];
