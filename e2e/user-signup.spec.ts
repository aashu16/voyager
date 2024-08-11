import { test, expect } from "@playwright/test";
import {
  approveRegistration,
  listRegistrationApplications,
  newLemmyClientWithCredentials,
} from "./init-lemmy-server";

const url = "http://localhost:8536/";

test("create user post", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("/posts/localhost:8536/all");
  await page.goto("/profile");

  const lemmyAdmin = await newLemmyClientWithCredentials(
    url,
    "voyager",
    "voyagerapp",
  );

  await expect(
    page.getByText("You are browsing localhost:8536 as"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Get Started" }).click();

  await page.getByRole("button", { name: "Join localhost:8536" }).click();
});
