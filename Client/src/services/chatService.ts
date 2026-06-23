import axiosClient from "@/lib/axiosClient";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatSearchResponse {
  message: string;
  filters: Record<string, string | number>;
  understood: boolean;
  properties: import("@/services/propertyService").ApiProperty[];
  count: number;
  suggestions?: string[];
}

export const chatService = {
  async search(
    message: string,
    history: ChatMessage[] = []
  ): Promise<ChatSearchResponse> {
    const { data } = await axiosClient.post<ChatSearchResponse>(
      "/chat/search",
      { message, history }
    );
    return data;
  },
};
