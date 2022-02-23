import ImageBack from "../components/ImageBack";
import styles from "./Wallet.module.scss";

export default function Wallet({ address, onClick }) {
    if (!address) {
        return (
            <ImageBack
                src="/images/m_wallet.png"
                className={styles.walletoff}
                text="Connect wallet"
                onClick={onClick}
            />
        );
    } else {
        return (
            <ImageBack
                src="/images/m_wallet.png"
                className={styles.walleton}
                text={address}
            />
        );
    }
}
