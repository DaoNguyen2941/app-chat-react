// hooks/useChatList.ts
import { useQuery } from '@tanstack/react-query';
import { getListChatService } from '../../services/chatService'; // điều chỉnh path cho đúng

export function useChatList() {
    return useQuery({
        queryKey: ['listChat'],
        queryFn: getListChatService,
        refetchInterval: 1000 * 60 * 5,
    });
}