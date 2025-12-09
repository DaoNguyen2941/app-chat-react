import { useQuery } from '@tanstack/react-query';
import { getListChatService } from '../../services/chatService';

export function useChatList() {
    return useQuery({
        queryKey: ['listChat'],
        queryFn: getListChatService,
        refetchInterval: 1000 * 60 * 5,
    });
}