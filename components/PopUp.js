import React, { useState, useEffect } from "react";
import RModal from "react-modal";
// import styles from './MintCard.module.scss'
import styles from "./PopUp.module.scss";

RModal.setAppElement("body");

const customStyles = {};

let poped = 0;

export default function PopUp({ timeout, text, num, type }) {
    let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [timerId, setTimerId] = useState(-1);
    // const [time, setTime] = useState(3)

    useEffect(() => {
        clearTimeout(timerId);
        setTimerId(setTimeout(closeModal, timeout));
        setIsOpen(true);
    }, [timeout, text, num]);

    // useEffect(())
    // useEffect(() => {
    //   // setTime(timeout)
    //   // console.log(timeout)
    //   setTimeout
    // }, [timeout])

    function openModal() {
        setIsOpen(true);
    }

    // function afterOpenModal() {
    //   // references are now sync'd and can be accessed.
    //   subtitle.style.color = '#f00';
    // }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <RModal
            isOpen={modalIsOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            // style={}
            contentLabel="Example Modal"
            className={styles.Modal}
            overlayClassName={styles.Overlay}
            // closeTimeoutMS={timeout}
            // appElement={document.getElementsByTagName("body")}
        >
            {console.log("timeout", timeout)}
            {console.log(WARN)}
            {type === WARN && <p className={styles.warning}>{text}</p>}
            {type !== WARN && <p>{text}</p>}
        </RModal>
    );
}

export const WARN = "WARN";
