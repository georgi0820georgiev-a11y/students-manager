import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <div id="wrapper" className="wrapper">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;