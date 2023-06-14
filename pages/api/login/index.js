import { defaultValues } from "../../../constant";
import { endPoints } from "../../../constant/endpoints";
const fetchInfo = async (id) => {
  const _auth = getAuth(defaultValues.environment_type);
  try {
    const response = await fetch(_auth.url + "/auth/api-login", {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify({
        api_key: "iamwebguru5",
        password: "yzt^cQWL#I5@A45or9",
      }),
    });
    const data = await response;

    if (data.statusText == "OK") {
      return data.json();
    }
    return { access_token: false };
  } catch (error) {
    return false;
  }
};

export default async function handler(req, res) {
  try {
    const result = await fetchInfo();
    res.status(200).json(result);
  } catch (error) {
    // unhide to check error
    res.status(500).json({ error: error.message });
  }
}

function getAuth(environment_type) {
  switch (environment_type) {
    case "local":
      return {
        url: defaultValues.local.baseurl,
      };
      break;
    case "staging":
      return {
        url: defaultValues.staging.baseurl,
      };
      break;
    case "production":
      return defaultValues.production.baseurl;
      break;
    default:
      return "";
  }
}
