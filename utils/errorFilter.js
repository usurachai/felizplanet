export const contractError = (error) => {
  // if (error.code)
  let msg = ""
  try {
    const errorMsg = error.message
    console.log(error.message)
    let s1 = errorMsg.indexOf('"message"')
    if (s1 < 0) {
      msg = error.message.split('(')[0]
    } else {
      s1 = errorMsg.indexOf('"', s1 + '"message"'.length)
      let s2 = errorMsg.indexOf('",', s1 + '",'.length)
      msg = errorMsg.slice(s1+1, s2)
    }
  } catch (err) {
    // console.log()
    console.log("error filter", err)
    msg = "Something wrong"
  }
  if (!msg) {
    msg = error.message.split('(')[0]
  }
  return msg
}

export default function errorFilter(error) {
  // console.log(error.code)
  // console.log(error.message)
  // let msg = ''
  // switch (error.code) {
  //   case 'UNSUPPORTED_OPERATION':
  //     msg = 'Please Connect Metamask'
  //     break
  //   default:
  //     msg = error.message
  //     break
  // }
  return error.message.split('(')[0];
}