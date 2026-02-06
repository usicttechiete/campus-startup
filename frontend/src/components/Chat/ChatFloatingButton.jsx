import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';

const ChatFloatingButton = () => {
    const navigate = useNavigate();
    const { role } = useRole();

    // Only show for relevant roles
    if (!['student', 'admin'].includes(role)) return null;

    return (
        <div className="fixed bottom-20 right-4 z-50 flex flex-col items-center gap-1">
            <button
                onClick={() => navigate('/chat')}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                aria-label="Open Chat"
            >
                <span className="text-xl">🤖</span>
            </button>
            <span className="text-[10px] font-medium text-muted drop-shadow-sm">Chat</span>
        </div>
    );
};

export default ChatFloatingButton;
