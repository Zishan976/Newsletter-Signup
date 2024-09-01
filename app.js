const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})



app.post("/", (req, res) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/623c2f8b7c";

    const options = {
        method: "POST",
        auth: "zishan1:6f89bfdcb90f11ab9a897363aa93b5d0-us14"
    }

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            response.on("data", (data) => {
                console.log(JSON.parse(data));
                res.sendFile(__dirname + "/success.html");
            });
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    });

    request.write(jsonData);
    request.end();
})

app.post("/failure", (req, res) => {
    res.redirect("/");


})

const port = process.env.PORT || 10000;

app.listen(port, () => {
    console.log("sarver is running on port 10000");
});

//apiKey
//0701f8724287b1727dbf7c956fa7483d-us14


//audienceId
//623c2f8b7c

//6f89bfdcb90f11ab9a897363aa93b5d0-us14