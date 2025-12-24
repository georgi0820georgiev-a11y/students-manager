import Header from './Header';
import Footer from './Footer';

function Layout(props) {
  return (
    <div id="wrapper" className="wrapper">
      <Header />
      <main>{props.children}</main>
      <Footer />
    </div>
  );
}

export default Layout;