import { test, expect } from "@playwright/test";
import { newLemmyClientWithCredentials } from "./init-lemmy-server";

const url = "http://localhost:8536/";

test("create user post", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("/posts/localhost:8536/all");
  await page.goto("/profile");

  try {
    const lemmyAdmin = await newLemmyClientWithCredentials(
      url,
      "voyager",
      "voyagerapp",
    );
  } catch (error) {
    throw new Error("Err:" + error);
  }

  await expect(
    page.getByText("You are browsing localhost:8536 as"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Get Started" }).click();

  await page.getByRole("button", { name: "Join localhost:8536" }).click();
});

test("create user post 2", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("/posts/localhost:8536/all");
  await page.goto("/profile");

  await expect(
    page.getByText("You are browsing localhost:8536 as"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Get Started" }).click();

  await page.getByRole("button", { name: "Join localhost:8536" }).click();
});
