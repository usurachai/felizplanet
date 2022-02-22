export const contractError = (error) => {
    // if (error.code)
    let msg = "";
    try {
        // console.log(error)
        // console.log("error code: ", error.code)
        // console.log("contract Error", error.message)
        // const errorMsg = error.message
        // let s1 = errorMsg.indexOf('{')
        // let s2 = errorMsg.indexOf('}')
        // console.log(s1, s2)
        // let newerror = errorMsg.slice(s1, s2)+'}'
        // // console.log("newerror: ", newerror)
        // // s1 = newerror.indexOf('{')
        // // s2 = newerror.lastIndexOf('}')
        // if (s1 === s2) {
        //   msg = error.message.split('(')[0]
        // } else {
        //   console.log(s1, s2)
        //   console.log(newerror.slice(s1, s2))
        //   newerror = JSON.parse(newerror)
        //   msg = newerror.message
        //   console.log(newerror)
        // }
        // console.log(err)
        // console.log(error)
        const errorMsg = error.message;
        let s1 = errorMsg.indexOf('"message"');
        s1 = errorMsg.indexOf('"', s1 + '"message"'.length);
        let s2 = errorMsg.indexOf('",', s1 + '",'.length);
        msg = errorMsg.slice(s1 + 1, s2);
    } catch (err) {
        // console.log()
        console.log("error filter", err);
        msg = "Something wrong";
    }
    if (!msg) {
        msg = error.message.split("(")[0];
    }
    return msg;
};
