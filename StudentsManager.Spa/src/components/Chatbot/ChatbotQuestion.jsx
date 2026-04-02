import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

function ChatbotQuestion({ text, onTypingComplete }) {
    const el = useRef(null);

    useEffect(() => {
        const typed = new Typed(el.current, {
            strings: [text],
            typeSpeed: 20,
            showCursor: false,
            onComplete: () => {
                if (onTypingComplete) onTypingComplete();
            }
        });

        return () => typed.destroy();
    }, [text, onTypingComplete]);

    return <div ref={el}></div>;
}

export default ChatbotQuestion;
