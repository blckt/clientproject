import 'whatwg-fetch';
export function fetchUrl(url,method,body) {
  return fetch(url,{
    method,
    body,
    headers: new Headers({
      Authorization:localStorage.token
    })
  });
}
