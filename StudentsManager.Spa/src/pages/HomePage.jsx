import React, { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGraduationCap,
    faComments,
    faRobot,
    faClipboardCheck,
} from '@fortawesome/free-solid-svg-icons';
import robotImage from '../assets/home/robot.png';
import './HomePage.css';

const FEATURES = [
    {
        icon: faGraduationCap,
        title: 'Course Management',
        desc: 'Track progress across modules with real-time analytics and smart recommendations.',
    },
    {
        icon: faComments,
        title: 'Forum',
        desc: 'Collaborate with peers and instructors in threaded, asynchronous discussions.',
    },
    {
        icon: faRobot,
        title: 'AI Chatbot',
        desc: 'Get instant, AI-powered answers to your technical and curriculum questions.',
    },
    {
        icon: faClipboardCheck,
        title: 'Tests & Quizzes',
        desc: 'Sharpen skills with adaptive assessments, instant feedback, and leaderboards.',
    },
];

const AnimatedNumber = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = parseInt(value);
        if (start === end) return;

        let totalMilisecondsStep = Math.abs(Math.floor(duration / end));
        let timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, totalMilisecondsStep);

        return () => clearInterval(timer);
    }, [value, duration]);
    return <>{count}</>;
};

function HomePage() {
    const canvasRef = useRef(null);
    const subtitleRef = useRef(null);
    const containerRef = useRef(null);
    const [timeLeft, setTimeLeft] = useState('');

    // Matrix rain canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[];:+-*';
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#5fb1a8';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        };
        const interval = setInterval(draw, 35);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Countdown to midnight
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);

            const diff = midnight - now;
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Typewriter effect on hero subtitle
    useEffect(() => {
        if (!subtitleRef.current) return;
        const typed = new Typed(subtitleRef.current, {
            strings: [
                'Elevating engineering through innovation and AI-driven logic.',
                'Where data meets design, and curiosity meets code.',
                'Your learning journey, supercharged by artificial intelligence.',
            ],
            typeSpeed: 38,
            backSpeed: 18,
            backDelay: 2800,
            startDelay: 500,
            loop: true,
            smartBackspace: true,
            cursorChar: '|',
        });
        return () => typed.destroy();
    }, []);

    // Scroll-triggered fade-in via IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                }),
            { threshold: 0.12 }
        );

        const sections = containerRef.current?.querySelectorAll('.fade-in-section');
        sections?.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className='hp-container' ref={containerRef}>
            <canvas ref={canvasRef} className='matrix-canvas' aria-hidden='true'></canvas>

            {/* Hero Section */}
            <section className='hp-hero' aria-labelledby='hero-title'>
                <div className='hero-content'>
                    <h1 className='hero-title' id='hero-title'>
                        Welcome <br />
                        <span>Heidelberg Materials</span>
                    </h1>
                    {/* subtitleRef is populated by typed.js — starts empty intentionally */}
                    <p className='hero-subtitle' ref={subtitleRef} aria-live='polite'></p>
                </div>
                <div className='robot-container' aria-hidden='true'>
                    <img src={robotImage} alt='' className='robot-anim' role='presentation' />
                </div>
            </section>

            {/* Platform Feature Cards */}
            <section
                className='hp-section features-section fade-in-section'
                aria-labelledby='features-title'
            >
                <div className='zone-header'>
                    <h2 className='zone-title' id='features-title'>
                        Platform Capabilities
                    </h2>
                    <p className='zone-sub'>Everything you need to master the curriculum</p>
                </div>
                <div className='features-grid'>
                    {FEATURES.map(({ icon, title, desc }) => (
                        <article
                            className='feature-card'
                            key={title}
                            tabIndex='0'
                            aria-label={title}
                        >
                            <div className='feature-icon-wrap' aria-hidden='true'>
                                <FontAwesomeIcon icon={icon} className='feature-icon' />
                            </div>
                            <h3 className='feature-card-title'>{title}</h3>
                            <p className='feature-card-desc'>{desc}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Learning Core */}
            <section
                className='hp-section engine-zone fade-in-section'
                aria-labelledby='engine-title'
            >
                <div className='zone-header'>
                    <h2 className='zone-title' id='engine-title'>
                        Learning Core
                    </h2>
                    <p className='zone-sub'>Real-time neural progress tracking</p>
                </div>

                <div className='engine-grid'>
                    <div className='engine-box' data-tooltip='12 tasks solved this week'>
                        <div className='box-top'>
                            <span className='box-label'>Algorithm Mastery</span>
                            <span className='box-percent'>
                                <AnimatedNumber value='75' />%
                            </span>
                        </div>
                        <div
                            className='box-bar'
                            role='progressbar'
                            aria-valuenow={75}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label='Algorithm Mastery progress'
                        >
                            <div className='box-fill' style={{ '--target-width': '75%' }}></div>
                        </div>
                        <div className='box-bottom'>
                            <span className='box-context'>15 tasks completed this week</span>
                            <span className='box-goal'>Next: reach 80% to unlock "Coder" badge</span>
                        </div>
                    </div>

                    <div className='engine-box' data-tooltip='Accuracy up by +5%'>
                        <div className='box-top'>
                            <span className='box-label'>Logic Precision</span>
                            <span className='box-percent'>
                                <AnimatedNumber value='92' />%
                            </span>
                        </div>
                        <div
                            className='box-bar'
                            role='progressbar'
                            aria-valuenow={92}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label='Logic Precision progress'
                        >
                            <div className='box-fill highlight' style={{ '--target-width': '92%' }}></div>
                        </div>
                        <div className='box-bottom'>
                            <span className='box-context'>Top 10% global accuracy</span>
                            <span className='box-goal'>Target: 95% for "Flawless" status</span>
                        </div>
                    </div>

                    <div className='engine-box' data-tooltip='Active 5-day streak!'>
                        <div className='box-top'>
                            <span className='box-label'>Total Uptime</span>
                            <span className='box-percent'>
                                <AnimatedNumber value='124' />h
                            </span>
                        </div>
                        <div
                            className='box-bar'
                            role='progressbar'
                            aria-valuenow={65}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label='Total Uptime progress'
                        >
                            <div className='box-fill gold' style={{ '--target-width': '65%' }}></div>
                        </div>
                        <div className='box-bottom'>
                            <span className='box-context'>Top 5% of this month</span>
                            <span className='box-goal'>3h more to reach "Senior" level</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Daily Challenge */}
            <section
                className='hp-section daily-challenge fade-in-section'
                aria-labelledby='challenge-title'
            >
                <div className='mac-terminal' role='region' aria-label='Daily coding challenge'>
                    <div className='terminal-header'>
                        <div className='terminal-buttons' aria-hidden='true'>
                            <span className='dot red'></span>
                            <span className='dot yellow'></span>
                            <span className='dot green'></span>
                        </div>
                        <div className='terminal-title'>daily_challenge.js</div>
                    </div>

                    <div className='terminal-body'>
                        <h2 className='challenge-title' id='challenge-title'>
                            Today's Mission
                        </h2>
                        <p className='challenge-desc'>
                            Write a function to find the first non-repeating character in a string.
                        </p>

                        <div className='code-container'>
                            <code className='challenge-snippet'>
                                {`function findFirstUnique(str) {
  // Your logic here...
  return result;
}`}
                            </code>
                        </div>

                        <div className='terminal-actions'>
                            <div className='challenge-timer'>
                                <span className='timer-label'>TIME REMAINING:</span>
                                <span className='timer-value' aria-live='polite' aria-label={`Time remaining: ${timeLeft}`}>
                                    {timeLeft}
                                </span>
                            </div>
                            <button className='solve-btn' aria-label='Start solving the daily challenge'>
                                INITIALIZE SOLVE
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Wall of Fame */}
            <section
                className='hp-section achievements-section fade-in-section'
                aria-labelledby='achievements-title'
            >
                <h2 className='section-title' id='achievements-title'>
                    Wall of Fame
                </h2>
                <div className='achievements-grid'>
                    <article className='achievement-card'>
                        <div className='firework-container' aria-hidden='true'>
                            <div className='firework'></div>
                            <div className='firework'></div>
                        </div>
                        <div className='achievement-icon' aria-hidden='true'>🏆</div>
                        <h3>Quiz Master</h3>
                        <p>100% Score on Advanced Matrix Quiz</p>
                        <div className='student-list' aria-label='Achievers'>
                            <span>@ivan_dev</span>
                            <span>@mary_js</span>
                            <span>@kris_tech</span>
                        </div>
                    </article>

                    <article className='achievement-card'>
                        <div className='firework-container' aria-hidden='true'>
                            <div className='firework'></div>
                            <div className='firework'></div>
                        </div>
                        <div className='achievement-icon' aria-hidden='true'>🤖</div>
                        <h3>Bot Whisperer</h3>
                        <p>Successfully debugged the AI Chatbot</p>
                        <div className='student-list' aria-label='Achievers'>
                            <span>@alex_99</span>
                            <span>@nina_codes</span>
                            <span>@george_m</span>
                        </div>
                    </article>

                    <article className='achievement-card'>
                        <div className='firework-container' aria-hidden='true'>
                            <div className='firework'></div>
                            <div className='firework'></div>
                        </div>
                        <div className='achievement-icon' aria-hidden='true'>📜</div>
                        <h3>Logic Architect</h3>
                        <p>Submitted flawless Homework #4</p>
                        <div className='student-list' aria-label='Achievers'>
                            <span>@stefan_v</span>
                            <span>@elena_b</span>
                            <span>@viktor_d</span>
                        </div>
                    </article>
                </div>
                <div className='achievements-actions'>
                    <button className='hp-btn timeline-btn'>View Full Timeline</button>
                </div>
            </section>

            {/* Final CTA */}
            <section className='hp-section hp-cta fade-in-section' aria-label='Call to action'>
                <h2 className='hero-title' style={{ textAlign: 'center', fontSize: '3rem' }}>
                    Ready to initialize?
                </h2>
                <button className='cta-main-btn' aria-label='Access the core system'>
                    ACCESS CORE SYSTEM
                </button>
            </section>
        </div>
    );
}

export default HomePage;
