import { getListChatGroupService, getListChatService } from "./chatService";
import { getListReqFriend, getListFriend } from "./friendService";
import { getGroupInvitationService } from "./chatService";

export const preloadQueriesConfig = [
    { queryKey: ['listChat'], queryFn: getListChatService, staleTime: 1000 * 60 * 5 },
    { queryKey: ['group-invitation'], queryFn: getGroupInvitationService, staleTime: 1000 * 60 * 10 },
    { queryKey: ['friend-requests'], queryFn: getListReqFriend, staleTime: 120000 },
    { queryKey: ['friends'], queryFn: getListFriend, staleTime: 1000 * 60 * 10 },

];
