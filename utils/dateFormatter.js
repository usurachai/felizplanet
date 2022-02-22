export default function formatDate(milis) {
    let tmp = Math.floor(milis / 1000);
    let s = tmp % 60;
    if (("" + s).length < 2) s = "0" + s;
    tmp = Math.floor(tmp / 60);
    let m = tmp % 60;
    if (("" + m).length < 2) m = "0" + m;
    tmp = Math.floor(tmp / 60);
    let h = tmp % 24;
    if (("" + h).length < 2) h = "0" + h;
    let d = Math.floor(tmp / 24);
    if (("" + d).length < 2) d = "0" + d;
    return [d, h, m, s].join(":");
}
