import React, { useState, useEffect } from "react";
import RModal from "react-modal";
// import styles from './MintCard.module.scss'
import styles from "./Modal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import { SpinningCircles } from "react-loading-icons";

RModal.setAppElement("body");

const customStyles = {};

export default function Modal({ title, content, type, num }) {
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(true);
    // const [msg, setMsg] = React.useState(true)

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        if (num <= 0) setIsOpen(false);
        else setIsOpen(true);
    }, [num]);

    return (
        <RModal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            // onRequestClose={closeModal}
            // style={}
            contentLabel="Example Modal"
            className={styles.Modal}
            overlayClassName={styles.Overlay}
            // appElement={document.getElementsByTagName("body")}
        >
            {/* <Circles/> */}
            <header>
                {type === LOADING && (
                    <SpinningCircles
                        // enableBackground
                        fill="#000"
                        color="#fff"
                        stroke="#fff"
                        strokeOpacity={0}
                        speed={0.75}
                        className={styles.Loading}
                    />
                )}
                {type === SUCCESS && (
                    <FontAwesomeIcon
                        icon={faCheck}
                        className={styles.Success}
                        // style={{ fontSize: 100, color: "orange" }}
                    />
                )}
                {type === FAILED && (
                    <FontAwesomeIcon
                        icon={faXmark}
                        className={styles.Failed}
                        // style={{ fontSize: 100, color: "orange" }}
                    />
                )}
                {/* {} */}
            </header>
            {type === LOADING && (
                <main className={styles.Loading}>
                    <p>{content}</p>
                </main>
            )}
            {type === SUCCESS && (
                <main className={styles.Success}>
                    <h5>{title}</h5>
                    <p>{content}</p>
                </main>
            )}
            {type === FAILED && (
                <main className={styles.Failed}>
                    <h5>{title}</h5>
                    <p>{content}</p>
                </main>
            )}
            <footer>
                {type === SUCCESS && (
                    <button onClick={closeModal} className={styles.Success}>
                        Close
                    </button>
                )}
                {type === FAILED && (
                    <button onClick={closeModal} className={styles.Failed}>
                        Close
                    </button>
                )}
            </footer>
        </RModal>
    );
}

export const SUCCESS = "SUCCESS";
export const LOADING = "LOADING";
export const FAILED = "FAILED";
