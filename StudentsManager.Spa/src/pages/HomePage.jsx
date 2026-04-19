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
import { getProfile } from '../services/userService';
import './HomePage.css';

// ─── Constants ───────────────────────────────────────────────────────────────

const PROFILE_ID = '022a6007-f33c-47c3-b811-08de88b121f2';

const FALLBACK_STATS = {
    mastery: 75,
    masteryBar: 75,
    precision: 92,
    precisionBar: 92,
    uptime: 124,
    uptimeBar: 65,
    masteryLabel: '15 tasks completed this week',
    precisionLabel: 'Top 10% global accuracy',
    uptimeLabel: 'Top 5% of this month',
};

const KONAMI_SEQUENCE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a',
];

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

const HEIDELBERG_CARDS = [
    {
        emoji: '🌍',
        title: 'Global Presence',
        desc: 'Operations in 50+ countries across every major continent.',
    },
    {
        emoji: '🏗️',
        title: 'Engineering Excellence',
        desc: '150+ years of innovation in building materials and construction.',
    },
    {
        emoji: '🎓',
        title: 'Education Focus',
        desc: 'Proud partner with top universities and engineering institutions worldwide.',
    },
];

// Generated once at module level — Math.random() is not allowed inside useMemo
const CONFETTI_PIECES = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${(Math.random() * 0.9).toFixed(2)}s`,
    color: `hsl(${Math.floor(Math.random() * 360)}, 75%, 60%)`,
    size: `${7 + Math.floor(Math.random() * 7)}px`,
    duration: `${2 + Math.random() * 1.2}s`,
}));

// ─── Sub-components ───────────────────────────────────────────────────────────

const AnimatedNumber = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = parseInt(value);
        if (start === end) return;
        const step = Math.abs(Math.floor(duration / end));
        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, step);
        return () => clearInterval(timer);
    }, [value, duration]);
    return <>{count}</>;
};

const SkeletonEngineBox = () => (
    <div className='engine-box skeleton-mode' aria-hidden='true'>
        <div className='box-top'>
            <span className='skel skel-label'></span>
            <span className='skel skel-percent'></span>
        </div>
        <div className='box-bar'>
            <div className='skel skel-fill'></div>
        </div>
        <div className='box-bottom'>
            <span className='skel skel-text-lg'></span>
            <span className='skel skel-text-sm'></span>
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

function HomePage() {
    const canvasRef = useRef(null);
    const subtitleRef = useRef(null);
    const containerRef = useRef(null);

    const [timeLeft, setTimeLeft] = useState('');
    const [stats, setStats] = useState(null); // null = loading
    const [easterEgg, setEasterEgg] = useState(false);
    // useRef avoids re-renders on every keypress while still tracking sequence position
    const konamiIdxRef = useRef(0);

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
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
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

    // Fetch real stats from API
    useEffect(() => {
        getProfile(PROFILE_ID)
            .then((data) => {
                const questions = data.testQuestions ?? [];

                if (questions.length === 0) {
                    setStats(FALLBACK_STATS);
                    return;
                }

                const total = questions.length;
                const correct = questions.filter((q) => q.wasCorrect).length;
                const mastery = Math.round((correct / total) * 100);

                // Weighted precision: recent 10 answers count double
                const recent = questions.slice(-10);
                const recentCorrect = recent.filter((q) => q.wasCorrect).length;
                const precision = Math.min(
                    100,
                    Math.round(((correct + recentCorrect * 2) / (total + recent.length)) * 100)
                );

                // Uptime: ~8 min per question attempt, bar capped at 200h
                const uptime = Math.max(1, Math.round((total * 8) / 60));
                const uptimeBar = Math.min(100, Math.round((uptime / 200) * 100));

                setStats({
                    mastery,
                    masteryBar: mastery,
                    precision,
                    precisionBar: precision,
                    uptime,
                    uptimeBar,
                    masteryLabel: `${correct} correct out of ${total} attempts`,
                    precisionLabel: `Based on last ${Math.min(10, total)} questions`,
                    uptimeLabel: `~${uptime}h total study time`,
                });
            })
            .catch(() => setStats(FALLBACK_STATS));
    }, []);

    // Konami code easter egg — useRef tracks index without triggering re-renders
    useEffect(() => {
        const handleKey = (e) => {
            const idx = konamiIdxRef.current;
            if (e.key !== KONAMI_SEQUENCE[idx]) {
                konamiIdxRef.current = e.key === KONAMI_SEQUENCE[0] ? 1 : 0;
                return;
            }
            const next = idx + 1;
            if (next === KONAMI_SEQUENCE.length) {
                setEasterEgg(true);
                setTimeout(() => setEasterEgg(false), 3200);
                konamiIdxRef.current = 0;
            } else {
                konamiIdxRef.current = next;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <div className='hp-container' ref={containerRef}>
            <canvas ref={canvasRef} className='matrix-canvas' aria-hidden='true'></canvas>

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <section className='hp-hero' aria-labelledby='hero-title'>
                <div className='hero-content'>
                    <h1 className='hero-title' id='hero-title'>
                        Welcome <br />
                        <span>Heidelberg Materials</span>
                    </h1>
                    <p className='hero-subtitle' ref={subtitleRef} aria-live='polite'></p>
                </div>
                <div className='robot-container' aria-hidden='true'>
                    <img src={robotImage} alt='' className='robot-anim' role='presentation' />
                </div>
            </section>

            {/* ── Platform Feature Cards ────────────────────────────────────── */}
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

            {/* ── Heidelberg Materials Partnership ─────────────────────────── */}
            <section
                className='hp-section heidelberg-section fade-in-section'
                aria-labelledby='heidelberg-title'
            >
                <div className='zone-header'>
                    <h2 className='zone-title' id='heidelberg-title'>
                        Heidelberg Materials
                    </h2>
                    <p className='zone-sub'>Powering Education with Heidelberg Materials</p>
                </div>
                <p className='heidelberg-intro'>
                    The University of Economics – Varna has partnered with Heidelberg Materials,
                    one of the world's largest manufacturers of building materials, to bring
                    real-world engineering challenges directly into the academic curriculum.
                    This collaboration bridges theoretical knowledge with industry practice,
                    giving students a competitive edge in a global market.
                </p>
                <div className='heidelberg-grid'>
                    {HEIDELBERG_CARDS.map(({ emoji, title, desc }) => (
                        <article className='heidelberg-card' key={title} tabIndex='0'>
                            <span className='heidelberg-emoji' aria-hidden='true'>{emoji}</span>
                            <h3 className='heidelberg-card-title'>{title}</h3>
                            <p className='heidelberg-card-desc'>{desc}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── Learning Core ─────────────────────────────────────────────── */}
            <section
                className='hp-section engine-zone fade-in-section'
                aria-labelledby='engine-title'
            >
                <div className='zone-header'>
                    <h2 className='zone-title' id='engine-title'>
                        Learning Core
                    </h2>
                    <p className='zone-sub'>
                        {stats === null ? 'Loading live data…' : 'Real-time neural progress tracking'}
                    </p>
                </div>

                {stats === null ? (
                    // ── Skeleton loading state
                    <div className='engine-grid' aria-label='Loading statistics' aria-busy='true'>
                        <SkeletonEngineBox />
                        <SkeletonEngineBox />
                        <SkeletonEngineBox />
                    </div>
                ) : (
                    // ── Real data
                    <div className='engine-grid'>
                        <div className='engine-box' data-tooltip='Percentage of correct answers'>
                            <div className='box-top'>
                                <span className='box-label'>Algorithm Mastery</span>
                                <span className='box-percent'>
                                    <AnimatedNumber value={stats.mastery} />%
                                </span>
                            </div>
                            <div
                                className='box-bar'
                                role='progressbar'
                                aria-valuenow={stats.mastery}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label='Algorithm Mastery progress'
                            >
                                <div
                                    className='box-fill'
                                    style={{ '--target-width': `${stats.masteryBar}%` }}
                                ></div>
                            </div>
                            <div className='box-bottom'>
                                <span className='box-context'>{stats.masteryLabel}</span>
                                <span className='box-goal'>Next: reach 80% to unlock "Coder" badge</span>
                            </div>
                        </div>

                        <div className='engine-box' data-tooltip='Weighted recent-answer accuracy'>
                            <div className='box-top'>
                                <span className='box-label'>Logic Precision</span>
                                <span className='box-percent'>
                                    <AnimatedNumber value={stats.precision} />%
                                </span>
                            </div>
                            <div
                                className='box-bar'
                                role='progressbar'
                                aria-valuenow={stats.precision}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label='Logic Precision progress'
                            >
                                <div
                                    className='box-fill highlight'
                                    style={{ '--target-width': `${stats.precisionBar}%` }}
                                ></div>
                            </div>
                            <div className='box-bottom'>
                                <span className='box-context'>{stats.precisionLabel}</span>
                                <span className='box-goal'>Target: 95% for "Flawless" status</span>
                            </div>
                        </div>

                        <div className='engine-box' data-tooltip='Estimated total study hours'>
                            <div className='box-top'>
                                <span className='box-label'>Total Uptime</span>
                                <span className='box-percent'>
                                    <AnimatedNumber value={stats.uptime} />h
                                </span>
                            </div>
                            <div
                                className='box-bar'
                                role='progressbar'
                                aria-valuenow={stats.uptimeBar}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label='Total Uptime progress'
                            >
                                <div
                                    className='box-fill gold'
                                    style={{ '--target-width': `${stats.uptimeBar}%` }}
                                ></div>
                            </div>
                            <div className='box-bottom'>
                                <span className='box-context'>{stats.uptimeLabel}</span>
                                <span className='box-goal'>3h more to reach "Senior" level</span>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* ── Daily Challenge ───────────────────────────────────────────── */}
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
                                {`function findFirstUnique(str) {\n  // Your logic here...\n  return result;\n}`}
                            </code>
                        </div>
                        <div className='terminal-actions'>
                            <div className='challenge-timer'>
                                <span className='timer-label'>TIME REMAINING:</span>
                                <span
                                    className='timer-value'
                                    aria-live='polite'
                                    aria-label={`Time remaining: ${timeLeft}`}
                                >
                                    {timeLeft}
                                </span>
                            </div>
                            <button
                                className='solve-btn'
                                aria-label='Start solving the daily challenge'
                            >
                                INITIALIZE SOLVE
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Wall of Fame ──────────────────────────────────────────────── */}
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

            {/* ── Final CTA ─────────────────────────────────────────────────── */}
            <section className='hp-section hp-cta fade-in-section' aria-label='Call to action'>
                <h2 className='hero-title' style={{ textAlign: 'center', fontSize: '3rem' }}>
                    Ready to initialize?
                </h2>
                <button className='cta-main-btn' aria-label='Access the core system'>
                    ACCESS CORE SYSTEM
                </button>
            </section>

            {/* ── Konami Easter Egg Overlay ─────────────────────────────────── */}
            {easterEgg && (
                <div
                    className='easter-overlay'
                    role='alert'
                    aria-live='assertive'
                    aria-label='Achievement unlocked: Code Ninja'
                >
                    <div className='confetti-container' aria-hidden='true'>
                        {CONFETTI_PIECES.map((p) => (
                            <div
                                key={p.id}
                                className='confetti-piece'
                                style={{
                                    '--left': p.left,
                                    '--delay': p.delay,
                                    '--color': p.color,
                                    '--size': p.size,
                                    '--duration': p.duration,
                                }}
                            />
                        ))}
                    </div>
                    <div className='easter-content'>
                        <div className='easter-icon' aria-hidden='true'>🎉</div>
                        <h2 className='easter-title'>Achievement Unlocked</h2>
                        <p className='easter-subtitle'>Code Ninja!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
