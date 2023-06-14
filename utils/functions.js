import { defaultValues } from "../constant";
import { endPoints } from "../constant/endpoints";

export function getCustomData() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const getCustomerDetailsFromUtilsFunc = async (orderno) => {
  try {
    const res = await fetch(endPoints.customer_details + orderno);
    const data = await res.json();

    if (data._404Status) {
      return { status: "404" };
    } else if (!data.errorStatus) {
      return { status: data };
      userApiLoadingState = false;
    } else {
      return { status: "elser" };
    }
  } catch (err) {
    return { status: err };
  }
  return false;
};

const constTetCustomerDetails = async (orderno) => {
  try {
    const res = await fetch(endPoints.customer_details + orderno);
    const data = await res.json();

    if (data._404Status) {
      return { status: "404" };
    } else if (!data.errorStatus) {
      return { status: data };
      userApiLoadingState = false;
    } else {
      return { status: "elser" };
    }
  } catch (err) {
    return { status: err };
  }
  return false;
};

export function formatOrderDate(createdDate) {
  const _date = new Date(createdDate);
  return _date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

export function formatTicketDate(createdDate) {
  var tempDate = createdDate.split("T");
  const _date = new Date(tempDate[0]);
  return _date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

export function getEnvVar(environment_type) {
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

export function commaSeparated(_param) {
  return _param.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function validateEmail(email) {
  var regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}

export function updateOrderNo(client, orderNo = null) {
  client.set(
    "ticket.customField:custom_field_" + defaultValues.ordernoFieldId,
    orderNo
  );
}

export function updateShipmentDetails(
  client,
  carrier = "",
  trackingNo = "",
  shippedDate = null,
  description = ""
) {
  trackingNo =
    carrier.toLowerCase() == "dhl" ? trackingNo.substring(8) : trackingNo;

  client.set(
    "ticket.customField:custom_field_" + defaultValues.trackingNoFieldId,
    trackingNo
  );

  client.set(
    "ticket.customField:custom_field_" + defaultValues.carrierFieldId,
    carrier.toLowerCase()
  );

  shippedDate =
    description.indexOf("Completed") != -1
      ? formatOrderDate(shippedDate)
      : null;
  client.set(
    "ticket.customField:custom_field_" + defaultValues.shippedDateId,
    shippedDate
  );
}

export function filterCarrierName(carrierType) {
  var matchCarrier = defaultValues.carrierName;
  if (carrierType.indexOf(matchCarrier.dhl) != -1) {
    return matchCarrier.dhl;
  } else if (carrierType.indexOf(matchCarrier.fedex) != -1) {
    return matchCarrier.fedex;
  } else if (carrierType.indexOf(matchCarrier.osm) != -1) {
    return matchCarrier.osm;
  } else if (carrierType.indexOf(matchCarrier.ups) != -1) {
    return matchCarrier.ups;
  } else if (carrierType.indexOf(matchCarrier.usps) != -1) {
    return matchCarrier.usps;
  }
  return carrierType;
}

export function getRequesterProfileURL( requesterId = 0 ){
  return (requesterId ) ? defaultValues.requesterProfileUrl.replace('_REQUESTER_ID_', requesterId):defaultValues.defaultRequesterProfileUrl;
}