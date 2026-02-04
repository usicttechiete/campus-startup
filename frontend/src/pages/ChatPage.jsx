import { useState, useRef, useEffect } from 'react';
import Button from '../components/Button/Button.jsx';
import Loader from '../components/Loader/Loader.jsx';

const ChatPage = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hi there! I am your AI assistant. How can I help you today?' },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.details || errorData.error || 'Failed to get response');
            }

            const data = await response.json();
            const aiMessage = { role: 'ai', content: data.reply };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'ai', content: `Error: ${error.message}. Please try again.` },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col rounded-3xl bg-card shadow-soft">
            {/* Header */}
            <div className="border-b border-border p-4">
                <h1 className="text-xl font-bold text-primary">AI Chat Assistant</h1>
                <p className="text-sm text-muted">Ask me anything about careers, startups, or events!</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                                ? 'bg-primary text-white rounded-tr-none'
                                : 'bg-surface text-body rounded-tl-none border border-border'
                                }`}
                        >
                            <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-surface rounded-2xl rounded-tl-none px-4 py-2 border border-border">
                            <Loader size="sm" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-4">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-xl border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none"
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        Send
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
