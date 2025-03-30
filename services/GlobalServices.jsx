import axios from "axios";

export const getToken = async () => {
  const result = await axios.get('/api/getToken');
  console.log("Token from GlobalServices:", result.data);
  return result.data;
}
