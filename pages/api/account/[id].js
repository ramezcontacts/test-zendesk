import { defaultValues } from "../../../constant";
const _auth = getEnvVar(defaultValues.environment_type);
const fetchInfo = async (id) => {
  const response = await fetch(_auth.baseurl + "/account/" + id, {
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
  }
  return data;
};

export default async function handler(req, res) {
  try {
    const result = await fetchInfo(req.query.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function getEnvVar(environment_type) {
  switch (environment_type) {
    case "local":
      return {
        baseurl: defaultValues.local.baseurl,
        apiAuth: defaultValues.local.apiAuth,
      };
      break;
    case "staging":
      return {
        baseurl: defaultValues.staging.baseurl,
        apiAuth: defaultValues.staging.apiAuth,
      };
      break;
    case "production":
      return {
        baseurl: defaultValues.production.baseurl,
        apiAuth: defaultValues.production.apiAuth,
      };

      break;
    default:
      return "";
  }
}
