const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const assert = require("assert");

describe("Hubtel Blog Automation Tests", function () {
  this.timeout(30000);

  let driver;

  this.beforeAll(async function () {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().setTimeouts({ implicit: 3000 });
  });

  it("Verify Navigation Links", async function () {
    await driver.get("https://blog.hubtel.com/");

    await driver.wait(until.elementLocated(By.css(".nav-link")), 10000);

    let navLinks = await driver.findElements(By.css(".nav-link"));
    for (let link of navLinks) {
      let href = await link.getAttribute("href");
      assert(href, "Navigation link is not working");
    }
  });

  it("Verify Main News Article", async function () {
    await driver.get("https://blog.hubtel.com/");
    await driver.wait(until.elementLocated(By.css(".blog-card")), 10000);

    let mainArticle = await driver.findElement(By.css(".blog-card"));
    assert(mainArticle, "No main news article found");
  });

  it("Verify Press Releases Articles", async function () {
    await driver.get("https://blog.hubtel.com/category/press-releases/");
    await driver.wait(
      until.elementsLocated(By.css(".border-bottom-muted")),
      15000
    );

    let pressArticles = await driver.findElements(
      By.css(".border-bottom-muted")
    );
    for (let article of pressArticles) {
      let image = await article.findElement(By.css("img"));
      let title = await article.findElement(
        By.xpath("//h5[contains(@class, 'fw-bold')]")
      );
      let date = await article.findElement(
        By.xpath("//p[contains(@class, 'text-muted mb-4 mb-md-0 fw-normal')]")
      );
      let duration = await article.findElement(
        By.xpath("//span[contains(@class, 'ps-4')]")
      );

      assert(image, "Press release article is missing image");
      assert(title, "Press release article is missing title");
      assert(date, "Press release article is missing date");
      assert(duration, "Press release article is missing reading duration");
    }
  });

  it("Verify Installation Links in Footer", async function () {
    await driver.get("https://blog.hubtel.com/");

    await driver.wait(
      until.elementLocated(
        By.css(".col-6.mb-4.mb-md-0.d-md-none.justify-content-md-end")
      ),
      15000
    );

    let installAppLinksContainer = await driver.findElement(
      By.css(".col-6.mb-4.mb-md-0.d-md-none.justify-content-md-end")
    );

    let installAppLinks = await installAppLinksContainer.findElements(
      By.css("ul li a")
    );

    let iOSLinkFound = false;
    let huaweiLinkFound = false;

    for (let link of installAppLinks) {
      let href = await link.getAttribute("href");
      if (href.includes("itunes.apple.com")) {
        iOSLinkFound = true;
      } else if (href.includes("appgallery.huawei.com")) {
        huaweiLinkFound = true;
      }
    }

    assert(iOSLinkFound, "iOS app download link not found in footer");
    assert(huaweiLinkFound, "Huawei AppGallery link not found in footer");
  });

  this.afterAll(async function () {
    await driver.quit();
  });
});
