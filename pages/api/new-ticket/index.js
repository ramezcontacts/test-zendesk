import { defaultValues } from "../../../constant";
import { endPoints } from "../../../constant/endpoints";
const fetchInfo = async (formData) => {
  try {
    const _auth = getAuth(defaultValues.environment_type);
    let ticket = {
      subject: "Request of order no:" + formData.orderno,
      comment: { body: formData.description },
      requester: {
        name: formData.firstname + " " + formData.lastname,
        email: formData.email,
      },
    };
    const response = await fetch(_auth.url, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: _auth.authorization,
      }),
      body: JSON.stringify({ ticket }),
    });
    const data = await response;
    if (data.status == "201") {
      return {
        data_status: data.status,
        data_statusText: data.statusText,
        status: "success",
        response: data.json(),
        responseCls: "text-success",
        responseMsg: "Request submitted successfully",
      };
    } else {
      return {
        status: "failed",
        data_status: data.status,
        data_statusText: data.statusText,
        response: data.json(),
        responseCls: "text-danger",
        responseMsg:
          "Getting error while submitting your request. Please try again.",
      };
    }
  } catch (error) {
    return false;
  }
};

export default async function handler(req, res) {
  try {
    const result = await fetchInfo(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function getAuth(environment_type) {
  switch (environment_type) {
    case "local":
      return {
        url: endPoints.zendesk.baseurl_test + endPoints.zendesk.ticket.create,
        authorization: defaultValues.local.zendesAuth,
      };
      break;
    case "staging":
      return {
        url: endPoints.zendesk.baseurl + endPoints.zendesk.ticket.create,
        authorization: defaultValues.staging.zendesAuth,
      };
      break;
    case "production":
      return defaultValues.production.baseurl;
      break;
    default:
      return "";
  }
}
