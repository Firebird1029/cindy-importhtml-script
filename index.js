const express = require("express");
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

const app = express();
const port = 3000;

// app.get("/:zillow1/:zillow2", function (req, res) {
// 	console.log(req.params);
// 	res.send("hi");
// });

app.get("*", async function (req, res) {
	console.log(req.url.substring(req.url.indexOf("homedetails/") + "homedetails/".length, req.url.length));
	console.log(req.url.substring(1, req.url.length));
	// (async () => {
	// 	const response = await fetch(req.url.substring(1, req.url.length));
	// 	const text = await response.text();
	// 	const dom = await new JSDOM(text);
	// 	console.log(dom.window.document.querySelector("h1").textContent);
	// })();

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

// rp({
// 	url: "https://www.zillow.com/...",
// 	transform: function (html) {
// 		return cheerio.load(html);
// 	},
// })
// 	.then(($) => {
// 		console.log($("span[data-testid='zestimate-text']").children().next().text());
// 	})
// 	.catch(function (err) {
// 		console.log(err);
// 	});
