import { test, expect } from "@playwright/test";
import {
  approveRegistration,
  listRegistrationApplications,
  newLemmyClientWithCredentials,
} from "./init-lemmy-server";

const url = "http://localhost/";

test.only("create user post", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("/posts/localhost/all");
  await page.goto("/profile");

  const lemmyAdmin = await newLemmyClientWithCredentials(
    url,
    "lemmy",
    "lemmylemmy",
  );

  await expect(page.getByText("You are browsing localhost as")).toBeVisible();

  await page.getByRole("button", { name: "Get Started" }).click();

  await page.getByRole("button", { name: "Join localhost" }).click();

  await page
    .locator("ion-button")
    .filter({ hasText: "I Agree" })
    .locator("button")
    .click();
  await page.getByLabel("Application Answer (Required)").click();
  await page
    .getByLabel("Application Answer (Required)")
    .fill("Testing voyager");
  await page
    .locator("ion-button")
    .filter({ hasText: "Next" })
    .locator("button")
    .click();

  await page.getByLabel("Email").click();
  await page.getByLabel("Email").fill("leeloo@voyager.app");
  await page.getByLabel("Username (Required)@@localhost").click();
  await page.getByLabel("Username (Required)@@localhost").fill("leeloo");
  await page.getByLabel("Password (Required)", { exact: true }).click();
  await page
    .getByLabel("Password (Required)", { exact: true })
    .fill("newpassword");
  await page.getByLabel("Confirm Password (Required)").click();
  await page.getByLabel("Confirm Password (Required)").fill("newpassword");
  await page
    .locator("ion-button")
    .filter({ hasText: "Submit" })
    .locator("button")
    .click();

  await expect(
    page.locator("ion-toolbar").filter({ hasText: /^✅ Success!$/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Login" }).click();

  const pendingApplications = await listRegistrationApplications(
    lemmyAdmin,
    {},
  );

  expect(pendingApplications.registration_applications.length).toBe(1);
  expect(pendingApplications.registration_applications[0].creator.name).toBe(
    "ted",
  );
  await approveRegistration(lemmyAdmin, {
    id: pendingApplications.registration_applications[0].creator.id,
    approve: true,
  });

  await page.getByLabel("Username or email").click();
  await page.getByLabel("Username or email").fill("leeloo");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("newpassword");
  await page.getByRole("button", { name: "Confirm" }).click();
});

test.only("login user", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("/posts/localhost/all");
  await page.goto("/profile");

  await page.getByRole("button", { name: "Get Started" }).click();

  await page.getByRole("button", { name: "Log In" }).click();
  await page.getByLabel("search text").click();
  await page.getByLabel("search text").fill("lo");
  await page
    .locator("ion-item")
    .filter({ hasText: "localhost" })
    .locator("div")
    .first()
    .click();
  await page.getByLabel("search text").press("Enter");
  await page.getByLabel("Username or email").fill("leeloo");
  await page.getByLabel("Username or email").press("Tab");
  await page.getByLabel("Password").fill("newpassword");
  await page.getByRole("button", { name: "Confirm" }).click();
});
