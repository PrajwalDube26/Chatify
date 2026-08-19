import { UserProvider } from './User';
import { FriendProvider } from './Friend';
import { MessageProvider } from './Message';

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