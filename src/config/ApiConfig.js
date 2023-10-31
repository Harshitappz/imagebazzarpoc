const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = apiUrl;

const BASE_URL_MAIN = `${baseUrl}/`;
const BASE_URL = process.env.REACT_APP_BASE_URL;
const BASE_IMAGE_URL = process.env.REACT_APP_BASE_IMAGE_URL;
const S3_BASE_URL = process.env.REACT_APP_S3_URL;
const LIVE_WEBSITE_URL = process.env.REACT_APP_LIVE_WEBSITE_URL;
const REACT_APP_SALT = process.env.REACT_APP_SALT;

let ApiConfig = {
  token: null,
  BASE_URL,
  BASE_IMAGE_URL,
  S3_BASE_URL,
  REACT_APP_SALT,
  LIVE_WEBSITE_URL,

  //keywords api
  getKeywords: `${BASE_URL_MAIN}admin/getKeywords`,
  visibleKeyword: `${BASE_URL_MAIN}admin/visiblekeywordpocapi`,

};

export default ApiConfig;
