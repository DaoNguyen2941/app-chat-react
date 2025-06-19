import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getGroupInvitationService } from '../../services/chatService';
import { IPendingInvitationGroup } from '../../type/chat.type';
import { useAppDispatch } from '../reduxHook';
import { useEffect, useRef } from 'react';
import { setGroupInvitation } from '../../store/notificationSlice';
export function useGroupInvitations(
    options?: UseQueryOptions<IPendingInvitationGroup[], Error>
) {
    const dispatch = useAppDispatch();
    const previousLength = useRef<number | null>(null);

    const query = useQuery<IPendingInvitationGroup[], Error>({
        queryKey: ['group-invitation'],
        queryFn: getGroupInvitationService,
        ...options,
    });

    useEffect(() => {
        if (query.data && query.data.length !== previousLength.current) {
            dispatch(setGroupInvitation(query.data.length));
            previousLength.current = query.data.length;
        }
    }, [query.data, dispatch]);

    return query;
}
