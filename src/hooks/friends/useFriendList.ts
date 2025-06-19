// hooks/useFriendInvitations.ts
import { useQuery } from '@tanstack/react-query';
import { getListFriend } from '../../services/friendService';
import { IDataFriendType } from '../../type/friend.type';

export function useFriendList(run: boolean) {
  return useQuery<IDataFriendType[]>({
    queryKey: ['friends'],
    queryFn: getListFriend,
    enabled: run, // Chỉ fetch khi open = true
  });
}
