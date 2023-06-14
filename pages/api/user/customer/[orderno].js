import { defaultValues } from "../../../../constant";
import { getEnvVar } from "../../../../utils/functions"

const _auth = getEnvVar(defaultValues.environment_type);
const fetchInfo = async (orderno) => {
  const response = await fetch(_auth.baseurl + "/customer-info-orderid/" + orderno, {
    headers: new Headers({
      Authorization: _auth.apiAuth,
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "content-type": "application/json",
    }),
  });
  const data = await response;

  if (data.statusText == "OK") {
    return data.json();
  } else if (data.status === 401 || data.status === 500) {
    return { errorStatus: true };
  } else if (data.status === 404) {
    return { _404Status: true };
  }
  return data;
};

export default async function handler(req, res) {
  try {
    // console.log("req.query.orderno: ", req.query.orderno)
    const result = await fetchInfo(req.query.orderno);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
