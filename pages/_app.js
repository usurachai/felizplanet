import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
import { MetaMaskProvider } from "metamask-react";
import "../styles/globals.css";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

const App = ({ Component, pageProps }) => {
    return (
        <MetaMaskProvider>
            <Component {...pageProps} />
        </MetaMaskProvider>
    );
};

export default App;
// kindacode.com
