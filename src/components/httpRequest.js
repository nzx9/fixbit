export const httpPOST = (url, data) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    };
    fetch(url, options)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const httpGET = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
