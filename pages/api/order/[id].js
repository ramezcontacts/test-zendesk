import { defaultValues } from "../../../constant";
import { endPoints } from "../../../constant/endpoints";
import useStorage from "../../../hooks/useStorage.ts";

const { getItem } = useStorage();
let authToken = getItem("token");
const _baseUrl = getBaseUrl(defaultValues.environment_type);

const fetchInfo = async (email) => {
  const response = await fetch(_baseUrl + "/get-sales-order/" + email, {
    headers: new Headers({
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiaWFtd2ViZ3VydTUiLCJpYXQiOjE2NjAwMjAyMDUsImV4cCI6MTY2MDEwNjYwNX0.1x1mM4ZUi3LjfDJWRx45nl7ESqGB6HRcbJGeVcNkxkM",
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
    const result = await fetchInfo(req.query.id);
    res.status(200).json(result);
  } catch (error) {
    // unhide to check error
    res.status(500).json({ error: error.message });
  }
}

function getBaseUrl(environment_type) {
  switch (environment_type) {
    case "local":
      return defaultValues.local.baseurl;
      break;
    case "staging":
      return defaultValues.staging.baseurl;
      break;
    case "production":
      return defaultValues.production.baseurl;
      break;
    default:
      return "";
  }
}
