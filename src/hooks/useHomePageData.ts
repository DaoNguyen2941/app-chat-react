import { useGroupInvitations } from "./chat/useGroupInvation";
import { useFriendList } from "./friends/useFriendList";
import { useFriendInvitations } from "./friends/useFriendInvitations";
import { useChatList } from "./chat/useChatList";

export function useHomePageData() {
  const { data: groupInvitation } = useGroupInvitations();
  const { data: friendList } = useFriendList(true);
  const { data: friendInvitations } = useFriendInvitations();
  const { data: chatList } = useChatList();

  return {
    groupInvitation,
    friendList,
    friendInvitations,
    chatList,
  };
}
 