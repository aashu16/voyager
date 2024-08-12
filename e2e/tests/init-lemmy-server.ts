import {
  ApproveRegistrationApplication,
  CreateCommunity,
  LemmyHttp,
  ListRegistrationApplications,
  Login,
  RegistrationApplicationResponse,
} from "lemmy-js-client";

export const login = async (lemmyClient: LemmyHttp, payload: Login) => {
  const response = await lemmyClient.login(payload);

  return response;
};

export const newLemmyClientWithCredentials = async (
  instanceUrl: string,
  username_or_email: string,
  password: string,
) => {
  const lemmyClient = new LemmyHttp(instanceUrl, { fetchFunction: fetch });

  try {
    const { jwt } = await login(lemmyClient, {
      username_or_email,
      password,
    });
    lemmyClient.setHeaders({ Authorization: `Bearer ${jwt}` });

    return lemmyClient;
  } catch (error) {
    throw new Error("nvlcwc:" + error);
  }
};

export const listRegistrationApplications = async (
  lemmyClient: LemmyHttp,
  payload: ListRegistrationApplications,
) => {
  const response = await lemmyClient.listRegistrationApplications(payload);

  return response;
};

export const approveRegistration = async (
  lemmyClient: LemmyHttp,
  payload: ApproveRegistrationApplication,
) => {
  const response = await lemmyClient.approveRegistrationApplication(payload);

  return response;
};

export const approveAllRegistrationApplications = async (
  lemmyClient: LemmyHttp,
) => {
  const response = await listRegistrationApplications(lemmyClient, {
    unread_only: false,
  });

  let pendingApplications: Promise<RegistrationApplicationResponse>[] = [];

  response.registration_applications.forEach(
    (application) =>
      (pendingApplications = [
        ...pendingApplications,
        approveRegistration(lemmyClient, {
          id: application.registration_application.id,
          approve: true,
        }),
      ]),
  );

  const res = await Promise.all(pendingApplications);

  return res;
};

export const createCommunity = async (
  lemmyClient: LemmyHttp,
  payload: CreateCommunity,
) => {
  const response = await lemmyClient.createCommunity(payload);

  return response;
};
