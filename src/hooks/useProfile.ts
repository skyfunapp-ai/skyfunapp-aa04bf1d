import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export interface ProfileData {
  name: string;
  occupation: string;
  hobbies: string[];
  interestedIn: string[];
  favoriteFood: string[];
  profilePhoto?: string;
  currentAirport?: string;
  destinationAirport?: string;
  skoinBalance: number;
}

const defaultProfile: ProfileData = {
  name: "",
  occupation: "",
  hobbies: [],
  interestedIn: [],
  favoriteFood: [],
  skoinBalance: 5,
};

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile = defaultProfile, isLoading: loading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return defaultProfile;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        return {
          name: data.name || "",
          occupation: data.occupation || "",
          hobbies: data.hobbies || [],
          interestedIn: data.interested_in || [],
          favoriteFood: data.favorite_food || [],
          profilePhoto: data.profile_photo || undefined,
          currentAirport: data.current_airport || undefined,
          destinationAirport: data.destination_airport || undefined,
          skoinBalance: data.skoin_balance,
        } as ProfileData;
      }
      return defaultProfile;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const updateProfile = async (data: Partial<ProfileData>) => {
    if (!user) return;
    const dbData: Record<string, unknown> = {};
    if (data.name !== undefined) dbData.name = data.name;
    if (data.occupation !== undefined) dbData.occupation = data.occupation;
    if (data.hobbies !== undefined) dbData.hobbies = data.hobbies;
    if (data.interestedIn !== undefined) dbData.interested_in = data.interestedIn;
    if (data.favoriteFood !== undefined) dbData.favorite_food = data.favoriteFood;
    if (data.profilePhoto !== undefined) dbData.profile_photo = data.profilePhoto;
    if (data.currentAirport !== undefined) dbData.current_airport = data.currentAirport;
    if (data.destinationAirport !== undefined) dbData.destination_airport = data.destinationAirport;
    dbData.updated_at = new Date().toISOString();

    await supabase.from("profiles").update(dbData).eq("id", user.id);
    queryClient.setQueryData(["profile", user.id], (prev: ProfileData) => ({ ...prev, ...data }));
  };

  const refetchProfile = () => queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });

  return { profile, loading, updateProfile, refetchProfile };
};

export const useConnections = () => {
  const { user } = useAuth();
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>([]);

  const fetchConnections = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("connections")
      .select("connected_user_id")
      .eq("user_id", user.id);
    setConnectedUserIds((data || []).map((r) => r.connected_user_id));
  }, [user]);

  useEffect(() => { fetchConnections(); }, [fetchConnections]);

  const addConnection = async (connectedUserId: string) => {
    if (!user) return;
    await supabase.from("connections").insert({ user_id: user.id, connected_user_id: connectedUserId });
    setConnectedUserIds((prev) => [...prev, connectedUserId]);
  };

  const isConnected = (userId: string) => connectedUserIds.includes(userId);

  return { connectedUserIds, addConnection, isConnected, refetch: fetchConnections };
};

export const useBlockedUsers = () => {
  const { user } = useAuth();
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

  const fetchBlocked = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("blocked_users")
      .select("blocked_user_id")
      .eq("user_id", user.id);
    setBlockedUserIds((data || []).map((r) => r.blocked_user_id));
  }, [user]);

  useEffect(() => { fetchBlocked(); }, [fetchBlocked]);

  const blockUser = async (blockedUserId: string) => {
    if (!user) return;
    await supabase.from("blocked_users").insert({ user_id: user.id, blocked_user_id: blockedUserId });
    setBlockedUserIds((prev) => [...prev, blockedUserId]);
  };

  const unblockUser = async (blockedUserId: string) => {
    if (!user) return;
    await supabase.from("blocked_users").delete().eq("user_id", user.id).eq("blocked_user_id", blockedUserId);
    setBlockedUserIds((prev) => prev.filter((id) => id !== blockedUserId));
  };

  const isBlocked = (userId: string) => blockedUserIds.includes(userId);

  return { blockedUserIds, blockUser, unblockUser, isBlocked, refetch: fetchBlocked };
};
