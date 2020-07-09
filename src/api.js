import axios from 'axios';

export const getWord = async (params) => {
  const apiKey = '111111111111111111111';
  params = { ...params, apiKey };

  try {
    const { data } = await axios.get(process.env.REACT_APP_API_URL, {
      params,
    });

    return data;
  } catch (err) {
    console.log(err);

    Promise.reject(err)
  }
}

export const searchImages = async (keyWord) => {
  const key = 'AIzaSyBhJMpfrgkynvxKW4jawiWfsNIVBJnTRF4';
  const cx = '003003722533896529227:irilh5jsuw0';
  const searchType = 'image';
  const url = `https://www.googleapis.com/customsearch/v1`
  try {
    const { data } = await axios.get(url, {
      params: {
        key,
        cx,
        searchType,
        q: keyWord,
      },
    });

    return data;
  } catch (err) {
    console.log(err);

    Promise.reject(err)
  }
}
