// const puppeteer = require("puppeteer"),
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
		console.log(ua.toString());
		await page.setUserAgent(ua.toString());
		// await page.setUserAgent(
		// 	"Mozilla/5.0 (X11; Linux x86_64)" + "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36"
		// );

		await page.goto(encodedUrl);

		// const example = await page.evaluate(() => {
		// 	const button = document.querySelector("p");

		// 	console.log("hi", button);

		// 	function simulateMouseEvent(el, eventName) {
		// 		let event;
		// 		if (window.MouseEvent && typeof window.MouseEvent === "function") {
		// 			event = new MouseEvent(eventName);
		// 		} else {
		// 			event = document.createEvent("MouseEvent");
		// 			event.initMouseEvent(eventName);
		// 		}

		// 		el.dispatchEvent(event);
		// 	}

		// 	setTimeout(() => {
		// 		simulateMouseEvent(button, "mousedown");
		// 	}, 5000);
		// });

		// const [button] = await page.$x("//p[contains(., 'Press & Hold')]");
		// if (button) {
		// 	console.log(button.text());
		// 	await button.click({ delay: 1000 });
		// } else {
		// 	console.log("no button found");
		// 	return;
		// }

		// await page.click("p", {
		// 	delay: 3000,
		// });

		// await page.waitForTimeout(3000);
		// console.log("screenshot");
		// await page.screenshot({ path: "1.png" });

		try {
			const parent = await page.waitForSelector('span[data-testid="zestimate-text"]', { timeout: 3000 });

			const zestimate = await parent.evaluate((el) => el.children[1].textContent);

			console.log(zestimate);
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

runPuppeteer("https://www.zillow.com/homes/...");
