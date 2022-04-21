export const errManager = (message) => {
    // console.log(message);
    const _match = String(message).match(/error=(.*?), method/);
    if (_match) {
        const error_code = JSON.parse(_match[1])["code"];

        if (error_code === -32000) {
            return "Insufficient funds for intrinsic transaction";
        } else {
            return JSON.parse(_match[1])["message"];
        }
    } else {
        if (typeof message === "object" && message !== null) {
            return message.message;
        }
        return message;
    }
};
