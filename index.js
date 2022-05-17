const express = require("express");
const app = express();

app.get("/", function (req, res) {
	res.send("hello from brandon");
});

app.get("/https:/*", async function (req, res) {
	console.log(req.url.substring(req.url.indexOf("homedetails/") + "homedetails/".length, req.url.length));
	console.log(req.url.substring(1, req.url.length));

	try {
		tries = 0;
		let doubleNum, singleNum;
		while (tries < 10) {
			const $ = await rp({
				url: req.url.substring(1, req.url.length),
				transform: function (html) {
					return cheerio.load(html);
				},
			});

			doubleNum = await $("span[data-testid='zestimate-text']").children().next().text();
			singleNum = doubleNum.substring(0, doubleNum.substring(1, doubleNum.length).indexOf("$") + 1);

			console.log(doubleNum, singleNum);

			if (!singleNum || singleNum === "") {
				tries++;
			} else {
				tries = 100;
			}
		}

		res.send(singleNum);
	} catch (error) {
		console.log(error);
		res.send("error", error);
	}
});

app.get("*", function (req, res) {
	res.send("hello from brandon -- check the URL for any errors :)");
});

app.listen(process.env.PORT || 3000, function () {
	console.log(`Example app listening on port ${process.env.PORT || 3000}!`);
});

const rp = require("request-promise");
const cheerio = require("cheerio");
