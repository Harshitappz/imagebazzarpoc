import axios from 'axios';
import ApiConfig from '../config/ApiConfig';

export const getVisibleKeywordListingNoRedux = async (payload) => {
  if (payload !== undefined) {
    try {
      const resp = await axios.post(`${ApiConfig.visibleKeyword}`, payload);
      if (
        resp?.data?.status >= 200 &&
        resp?.data?.status < 400
      ) {
        return resp?.data?.data?.rows
      } else {
        throw resp;
      }
    } catch (e) {
      return []
    }
  }
};