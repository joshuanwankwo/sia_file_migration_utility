import { API_ENDPOINT, REGISTER_ENDPOINT } from "../constants";

export const register = async () => {
  return fetch(REGISTER_ENDPOINT, {
    method: "POST",
    redirect: "follow",
  })
    .then(async (res) => await res.json())
    .then((result) => {
      window.localStorage.setItem("token", JSON.stringify(result));
      return result;
    })
    .catch((err) => console.log(err));
};

export const logOut = () => {
  window.localStorage.removeItem("token");
  window.location.reload();
};

export const uploadToRenterd = async (file: File) => {
  console.log("Uploading...");
  const password = window.localStorage.getItem("token");
  const username = "";
  const authHeader =
    "Basic " + btoa(username + ":" + JSON.parse(password as string));
  const key = (Math.random() + 1).toString(36).substring(7);

  await fetch(`${API_ENDPOINT}judicodes/files/${key}`, {
    method: "PUT",
    redirect: "follow",
    body: file,
    headers: {
      Authorization: authHeader,
    },
  })
    .then(async (res) => {
      await res.text();
      console.log("File uploaded successfully!");
    })
    .catch((err) => console.log(err));
};

export const getBase64Url = (name: string, authHeader: any) => {
  return new Promise(async (resolve, reject) => {
    const singleResponse = await fetch(
      `${API_ENDPOINT}judicodes/files/${name}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: authHeader,
        },
      }
    );

    const data = await singleResponse.blob();
    const blob = new Blob([data], {});
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      resolve(reader.result?.toString());
    };
    reader.onerror = function (err) {
      reject(err);
    };
  });
};

export const downloadFromRentred = async () => {
  console.log("Downloading file");

  const password = window.localStorage.getItem("token");
  const username = "";

  const authHeader =
    "Basic " + btoa(username + ":" + JSON.parse(password as string));

  const res = await fetch(`${API_ENDPOINT}judicodes/files`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: authHeader,
    },
  });
  const newRes = await res.json();

  const urls = await Promise.all(
    newRes.map(async (res: { name: string }) => {
      const url = await getBase64Url(res.name, authHeader);
      return { name: res.name, url: url };
    })
  );
  console.log("Fils downloaded successfully!");

  return urls;
};

export const handleSiaDelete = (key: string) => {
  console.log("deleteing...");

  const password = window.localStorage.getItem("token");
  const username = "";
  const authHeader =
    "Basic " + btoa(username + ":" + JSON.parse(password as string));
  fetch(`${API_ENDPOINT}judicodes/files/${key}`, {
    method: "DELETE",
    redirect: "follow",
    headers: {
      Authorization: authHeader,
    },
  })
    .then(async (res) => {
      await res.text();
      window.location.reload();
    })
    .catch((err) => console.log(err));
};
