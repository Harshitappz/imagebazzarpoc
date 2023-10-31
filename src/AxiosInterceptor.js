import axios from 'axios';

axios.interceptors.request.use((request) => requestHandler(request));

axios.interceptors.response.use(
  (response) => {
    checkTokenIsValid(response);
    return response;
  },
  (error) => errorHandler(error),
);

const checkTokenIsValid = (response) => {
  if (response?.data?.status == 401) {
    alert('Unauthrize')
  }
};

const requestHandler = async (request) => {
  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MiwiaWF0IjoxNjk3NDc0MjMxLCJleHAiOjE2OTc1NDYyMzF9.uwLUNZ7ETcK67g-oUqe7a8X_mj4MXhI24RBDZKtIEOo';

  request.headers = {
    Authorization: `${token}`,
    // 'X-CSCAPI-KEY': "RmtmRFFKZDg3Y0cyaTVMWlNpNHVYcjV2VWZ3OWZGWU9nRHlpYkJuNQ==",
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...request.headers
  };
  // console.log('REQUEST_URL', request.url);
  // console.log('request', request);
 
  return request;
};

const errorHandler = async (error) => {
  console.log('errorHandler', error.response);
  throw error.response;
};
