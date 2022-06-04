// https://stackoverflow.com/questions/66370361/next-js-server-side-api-read-and-write-json
const fs = require("fs");

export default async function handler(req, res) {
    //...
    // if (req.method === "POST") {
    //     fs.writeFileSync("./data/qouta.json", JSON.stringify(req.body));
    //     return res.status(200).json({});
    // }
    //...

    // read json
    if (req.method === "GET") {
        const content = fs.readFileSync("./data/qouta.json", "utf8");
        return res.status(200).json(content ? JSON.parse(content) : []);
    }

    // update json
    // /api/qouta?acc=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    if (req.method === "PUT") {
        // console.log(req.query);
        const content = fs.readFileSync("./data/qouta.json", "utf8");
        const qouta = content ? JSON.parse(content) : [];

        // update existing
        const newqouta = qouta.map((q) =>
            q.account.toUpperCase() == req.query.acc.toUpperCase()
                ? { ...q, qouta: 0 }
                : q
        );

        // add new line for new
        const ex = qouta.find(
            (o) => o.account.toUpperCase() == req.query.acc.toUpperCase()
        );

        if (!ex) {
            // not found
            fs.writeFileSync(
                "./data/qouta.json",
                JSON.stringify([
                    { account: req.query.acc.toUpperCase(), qouta: 0 },
                    ...newqouta,
                ])
            );
        } else {
            fs.writeFileSync("./data/qouta.json", JSON.stringify(newqouta));
        }

        return res.status(200).json("OK");
    }
}
