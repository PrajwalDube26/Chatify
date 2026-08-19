import { UserProvider, useUser, UserContext } from './User';
import { FriendProvider, useFriend, FriendContext } from './Friend';
import { MessageProvider, useMessage, MessageContext } from './Message';

export const AppProvider = ({ children }) => {
    return (
        <UserProvider>
            <FriendProvider>
                <MessageProvider>
                    {children}
                </MessageProvider>
            </FriendProvider>
        </UserProvider>
    );
};

export default AppProvider;