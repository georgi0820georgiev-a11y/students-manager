import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Chatbot from '../components/Chatbot/Chatbot';
import robot from '../assets/chatbot/robot.png';

function ChatbotPage() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.soge-page-header',
                { autoAlpha: 0, y: -30 },
                { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }
            );

            gsap.fromTo(
                '.soge-robot',
                { autoAlpha: 0, y: 60 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1,
                    delay: 0.3,
                    ease: 'power2.out',
                    onComplete() {
                        gsap.to('.soge-robot', {
                            y: 12,
                            duration: 2,
                            ease: 'sine.inOut',
                            yoyo: true,
                            repeat: -1,
                        });
                    },
                }
            );

            gsap.fromTo(
                '.soge-young-chatbot',
                { autoAlpha: 0, y: 40 },
                { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.5, ease: 'power2.out' }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="chatbot-page" ref={containerRef}>
            <header className="soge-page-header">
                <h1 className="soge-page-title">Chat with #Robo</h1>
                <p className="soge-page-subtitle">
                    Answer a few quick questions and get personalised guidance
                </p>
            </header>

            <div className="soge-chatbot-layout">
                <div className="soge-robot-wrapper">
                    <img src={robot} alt="" className="soge-robot" aria-hidden="true" />
                </div>
                <Chatbot />
            </div>
        </div>
    );
}

export default ChatbotPage;
