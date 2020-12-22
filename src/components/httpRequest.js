export const httpReq = (url, method, data = null, token = null) => {
  return new Promise((resolve, reject) => {
    let headers;
    let options;
    if (token === null) {
      headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
    } else {
      headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    }
    if (method === "GET" || method === "HEAD") {
      options = {
        method: method,
        headers: headers,
      };
    } else {
      options = {
        method: method,
        headers: headers,
        body: JSON.stringify(data),
      };
    }
    fetch(url, options)
      .then((response) => resolve(response))
      .catch((err) => {
        reject(err);
      });
  });
};
