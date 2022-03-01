/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from "react";
import RModal from "react-modal";
// import styles from './MintCard.module.scss'
import styles from "./Modal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import { SpinningCircles } from "react-loading-icons";

RModal.setAppElement("body");

export default function Modal({
    title,
    content,
    type,
    num,
    btnTxt,
    action,
    input,
    errmsg,
    closable,
}) {
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(true);
    const [value, setValue] = useState("");

    const onChange = (e) => {
        const input = e.currentTarget.value;
        console.log(/^[0][x][0-9a-fA-F]+$/.test(input));
        if (isHexAddress(input)) {
            setValue(input);
        }
    };

    const isHexAddress = (input) => {
        if (
            (input.length > 2 && /^[0][x][0-9a-fA-F]+$/.test(input)) ||
            input === "" ||
            input === "0" ||
            input === "0x"
        ) {
            return true;
        } else return false;
    };
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
        else {
            setIsOpen(true);
            setValue(input);
        }
    }, [num, input]);

    return (
        <RModal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={() => {
                console.log(closable);
                if (closable) {
                    closeModal();
                }
            }}
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
            {(type === SUCCESS || type === INFO) && (
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
            {type === INPUT && (
                <main className={styles.Input}>
                    <h5>{title}</h5>
                    <input
                        value={value}
                        onChange={onChange}
                        onPaste={(event) => {
                            let paste = (
                                event.clipboardData || window.clipboardData
                            ).getData("text");
                            // paste = paste.toUpperCase();
                            console.log(paste);
                            console.log(isHexAddress(paste));
                            if (isHexAddress(paste)) setValue(paste);

                            // const selection = window.getSelection();
                            // if (!selection.rangeCount) return false;
                            // selection.deleteFromDocument();
                            // selection.getRangeAt(0).insertNode(document.createTextNode(paste));

                            event.preventDefault();
                        }}
                    />
                    <p>{errmsg}</p>
                </main>
            )}
            <footer>
                {(type === SUCCESS || type === INFO) && (
                    <button
                        onClick={() => {
                            console.log(action);
                            if (action) action.action();
                            else closeModal();
                        }}
                        className={styles.Success}
                    >
                        {btnTxt && btnTxt}
                        {!btnTxt && "Close"}
                    </button>
                )}
                {type === FAILED && (
                    <button
                        onClick={() => {
                            if (action) action.action();
                            else closeModal();
                        }}
                        className={styles.Failed}
                    >
                        {btnTxt && btnTxt}
                        {!btnTxt && "Close"}
                    </button>
                )}
                {type === INPUT && (
                    <button
                        className={styles.Input}
                        onClick={() => {
                            if (action) action.action(value);
                            else closeModal();
                        }}
                    >
                        {btnTxt && btnTxt}
                        {!btnTxt && "OK"}
                    </button>
                )}
            </footer>
        </RModal>
    );
}

export const SUCCESS = "SUCCESS";
export const LOADING = "LOADING";
export const FAILED = "FAILED";
export const INFO = "INFO";
export const INPUT = "INPUT";
