import 'whatwg-fetch';
const DEFAULT_URL='http://localhost:3000';
export function fetchUrl(url,method,body) {
  const link= url.indexOf('localhost')>-1?url:`${DEFAULT_URL}/${url}`;
  return fetch(link,{
    method,
    body,
    headers: new Headers({
      Authorization:localStorage.token
    })
  });
}
