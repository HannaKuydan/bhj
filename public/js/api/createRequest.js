/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const { method, data, callback } = options;
  const xhr = new XMLHttpRequest();

  let requestURL = options.url;
  let requestData = null;
  if (method === "GET") {
    const safeData = data || {};
    const queryParams = Object.entries(safeData)
      .map(([key, val]) => `${key}=${val}`)
      .join("&");

    requestURL += `?${queryParams}`;
  } else if (data) {
    requestData = new FormData();
    Object.entries(data).forEach(([key, val]) => requestData.append(key, val));
  }

  xhr.open(method, requestURL);
  xhr.responseType = "json";

  xhr.onerror = () => {
    callback(new Error(`Request failed. Status: ${xhr.status}`), null);
  };

  xhr.onload = () => {
    callback(null, xhr.response);
  };

  xhr.send(requestData);
};
