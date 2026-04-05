// Shared message store used by MessagesPage and SearchPage
export const messageStore: Record<string, { text: string; fromMe: boolean; timestamp: number; status?: "sent" | "delivered" | "seen"; image?: string }[]> = {};
export const readCountStore: Record<string, number> = {};
export const userCache: Record<string, { id: string; name: string; profilePhoto?: string }> = {};
