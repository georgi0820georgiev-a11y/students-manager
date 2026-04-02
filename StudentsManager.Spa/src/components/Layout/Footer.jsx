import { useCallback } from 'react';

function Footer() {

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <footer className="footer">
      <div className="footer-box">
        <div className="footer-tools">
          <div className="scroll-top">
            <button 
              className="scroll-top-btn" 
              onClick={scrollToTop}
            >
              Върни се в началото
            </button>
          </div>
      
        </div>
        
        <div className="footer-copy-right">
          <span className="copy-right">
            &copy; {new Date().getFullYear()} Students Manager
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;