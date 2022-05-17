/*
 * https://bretcameron.medium.com/how-to-build-a-web-scraper-using-javascript-11d7cd9f77f2
 * https://medium.com/@tommypang04/static-web-page-scraping-with-node-js-fd2f0a0d9c37
 * https://cheerio.js.org/classes/Element.html#next
 */

const express = require("express");
const app = express();

app.get("/", function (req, res) {
	res.send("hello from brandon");
});

app.get("/scrape/:addr", async function (req, res) {
	const result = await runPuppeteer(`https://www.zillow.com/homes/${req.params.addr}`);
	res.send(result);
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

// --- 2 ---

const rp = require("request-promise");
const cheerio = require("cheerio");

const puppeteer = require("puppeteer-extra");
const userAgent = require("user-agents");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const res = require("express/lib/response");
puppeteer.use(StealthPlugin());

async function runPuppeteer(encodedUrl) {
	const browser = await puppeteer.launch({ headless: false });

	let triesRemaining = 5;

	while (triesRemaining > 0) {
		const page = await browser.newPage();

		const ua = new userAgent();
		await page.setUserAgent(ua.toString());

		await page.goto(encodedUrl);

		try {
			const parent = await page.waitForSelector('span[data-testid="zestimate-text"]', { timeout: 3000 });

			const zestimate = await parent.evaluate((el) => el.children[1].textContent);

			await browser.close();

			return zestimate;
		} catch (error) {
			console.log("Probably timed out");
		}

		triesRemaining--;
	}

	await browser.close();

	return "?";
}
