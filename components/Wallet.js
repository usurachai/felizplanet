import ImageBack from "../components/ImageBack";
import styles from "./Wallet.module.scss";

export default function Wallet({ address, onClick, className }) {
    if (!address) {
        return (
            <ImageBack
                src="/images/m_wallet.png"
                className={styles.walletoff + " " + className}
                text="Connect wallet"
                onClick={onClick}
            />
        );
    } else {
        return (
            <ImageBack
                src="/images/m_wallet.png"
                className={styles.walleton + " " + className}
                text={address}
            />
        );
    }
}
