const express = require("express");
const app = express();
const port = 3000;

app.get("/", function (req, res) {
	res.send("hello from brandon");
});

app.get("*", async function (req, res) {
	console.log(req.url.substring(req.url.indexOf("homedetails/") + "homedetails/".length, req.url.length));
	console.log(req.url.substring(1, req.url.length));

	try {
		const $ = await rp({
			url: req.url.substring(1, req.url.length),
			transform: function (html) {
				return cheerio.load(html);
			},
		});

		console.log($("span[data-testid='zestimate-text']").children().next().text());
		res.send($("span[data-testid='zestimate-text']").children().next().text());
	} catch (error) {
		console.log(error);
		res.send("error", eror);
	}
});

app.listen(port, function () {
	console.log(`Example app listening on port ${port}!`);
});

const rp = require("request-promise");
const cheerio = require("cheerio");
