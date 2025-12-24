import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import gsap from 'gsap';
import logo from '../../assets/icons/logo.svg';

function Header() {
    const { isLoggedIn, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolledDown, setIsScrolledDown] = useState(false);
    const lastScrollTop = useRef(0);
    const headerRef = useRef(null);
    const menuItemsRef = useRef([]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const headerHeightThreshold = 105;

            if (scrollTop > headerHeightThreshold) {
                setIsScrolledDown(scrollTop > lastScrollTop.current);
            }
            lastScrollTop.current = scrollTop;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isMobileMenuOpen || menuItemsRef.current.length === 0) {
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                menuItemsRef.current,
                { autoAlpha: 0, y: 15 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.6,
                    ease: 'power4.out',
                    stagger: 0.12
                }
            );
        });

        return () => ctx.revert();
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    const setMenuItemRef = useCallback((index) => (el) => {
        if (el) {
            menuItemsRef.current[index] = el;
        }
    }, []);

    const handleLogout = useCallback(() => {
        logout();
        closeMobileMenu();
    }, [logout, closeMobileMenu]);

    const headerClassName = [
        'header',
        isMobileMenuOpen && 'active-mobile-menu',
        isScrolledDown && 'down-state'
    ].filter(Boolean).join(' ');

    return (
        <header ref={headerRef} className={headerClassName}>
            <div className="header-wrap">
                {/* Mobile Menu Row */}
                <div className="mobile-menu-row">
                    <div className="mobile-logo-container">
                        <Link to="/" className="mobile-logo-link" onClick={closeMobileMenu}>
                            <img src="/images/icons/logo.svg" alt="logo" className="template-image" />
                        </Link>
                    </div>
                    <div className="mobile-menu-container">
                        <div className="mobile-menu-btn-wrap">
                            <button
                                type="button"
                                className={`menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
                                onClick={toggleMobileMenu}
                                aria-label="Toggle menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <span className="lines-wrap">
                                    <span className="line line1" />
                                    <span className="line line2" />
                                    <span className="line line3" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Header */}
                <div className="header-box">
                    <div className="header-box-inner">
                        <nav className="nav">
                            <ul className="menu menu-left">
                                <li className="menu-item" ref={setMenuItemRef(0)}>
                                    <Link to="/profile" className="menu-link" onClick={closeMobileMenu}>
                                        Profile
                                    </Link>
                                </li>
                            </ul>

                            <h1 className="logo">
                                <Link to="/" className="logo-link desktop" onClick={closeMobileMenu}>
                                    <img src={logo} alt="Logo" />
                                </Link>
                            </h1>

                            <ul className="menu menu-right">
                                <li className="menu-item" ref={setMenuItemRef(1)}>
                                    <Link to="/slido" className="menu-link" onClick={closeMobileMenu}>
                                        Slido
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        <div className="login-container" ref={setMenuItemRef(2)}>
                            <div className="login-container-inner">
                                <div className="login-btn-wrap">
                                    {isLoggedIn ? (
                                        <button
                                            type="button"
                                            className="login btn"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="login btn"
                                            onClick={closeMobileMenu}
                                        >
                                            Login
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;