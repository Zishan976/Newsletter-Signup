const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require('dotenv').config();
console.log(`MAILCHIMP_API_KEY: ${process.env.MAILCHIMP_API_KEY}`);
console.log(`MAILCHIMP_LIST_ID: ${process.env.MAILCHIMP_LIST_ID}`);

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

    const url = `https://us14.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}`;

    const options = {
        method: "POST",
        auth: `anystring:${process.env.MAILCHIMP_API_KEY}`
    };

    const request = https.request(url, options, (response) => {
        console.log(`Status Code: ${response.statusCode}`);
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

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



