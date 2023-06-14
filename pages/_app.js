import '../styles/bootstrap.min.css'
import '../styles/globals.css'
// import '../styles/index.css';
import '../styles/new-index.css';
import "@fortawesome/fontawesome-svg-core/styles.css";
import '../components/accordion/Accordion.css';
import { config } from "@fortawesome/fontawesome-svg-core";
import '../components/accordion/Accordion.css';
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
