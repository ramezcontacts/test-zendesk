/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Script from "next/script";

import dynamic from "next/dynamic";

import { endPoints } from "../constant/endpoints";
import { defaultValues } from "../constant";
import React from "react";

let envType, ticketId;

export default function Home() {
  envType = defaultValues.environment_type;
  console.log("App render");

  const [keyParam, setKeyParam] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState([])
  // const [ticketId, setTicketId] = useState(null)

  const UserInfoComponent = dynamic(() => 
    import("../components/UserInfo"));
  const OrderAggrigateComponent = dynamic(() =>
    import("../components/OrderAggregate")
  );
  const PreviousOrdersComponent = dynamic(() =>
    import("../components/PreviousOrders")
  );

  const getTrackingInfo = async ( orderNo, client ) => {
    try {
      console.log("in getTrackingInfo");
      console.log("here in getTrackingInfo: ", orderNo)
      const res = await fetch(endPoints.get_tracking_info + orderNo);
      const data = await res.json();
  
      if (data._404Status) {
        return {"status":"404"};
      } else if (!data.errorStatus) {
        console.log("==> ",data[0].multiple);
        if(data[0].multiple == false){
          console.table("result found ==>", data[0]);
          setTrackingInfo(["dlfkjklfjsfj", "fjsldkfj"]);
          console.log("setTrackingInfo: ==> ", trackingInfo);
          client.set('ticket.customField:custom_field_' + defaultValues.trackingNoFieldId, data[0].ship_tracking_number);
          client.set('ticket.customField:custom_field_' + defaultValues.carrierFieldId, data[0].name.toLowerCase());
          // return data; 
        }
      } else {
        return {"status":"else"};
        
      }
      //setTrackingInfo(data[0])
      console.log("setTrackingInfoaa: ==> ", trackingInfo);
    } catch (err) {
      return {"status":err};
      //console.log("try catch error logs: ",err);
    }
  }
  function refreshAppInfo(_ticketId, client, isInit, requesterEmail = ""){
    var ticketData = {
      url: endPoints.zendesk.tickets + _ticketId,
      type: "GET",
      dataType: "json",
    };
    client.request(ticketData).then(function (data) {
      let customFields = data.ticket.custom_fields;
      const index = customFields.findIndex(
        (x) => x.id === defaultValues.ordernoFieldId
      );
     /*
     const trackingNoindex = customFields.findIndex(
        (x) => x.id === defaultValues.ordernoFieldId
      );
      const carrierIndex = customFields.findIndex(
        (x) => x.id === defaultValues.ordernoFieldId
      );
      */

      const orderno = customFields[index].value;

        if ( orderno != null && (orderno)) {
          console.log(" ==>  here in orderno");

         // ( customFields[trackingNoindex].value == null || customFields[carrierIndex].value == null  ) ? getTrackingInfo(orderno, client) : false;
          
          if (isInit) {
            setKeyParam(orderno);
          }
          setLoading(false);
        } else {
          console.log("here in email")
          if (isInit) {
            setKeyParam(requesterEmail);
          }
          setLoading(false);
        }
    });
  }

  const getRequester = async () => {
    var client = ZAFClient.init();
    client.invoke("resize", { width: "100%", height: "600px" });
    const requester = await client.get("ticket");
    console.log("form id ===> ", requester["ticket"].form.id);
    ticketId = requester["ticket"].id;

    if ( requester["ticket"].form.id ) {
      refreshAppInfo( requester["ticket"].id, client, true, requester["ticket"].requester.email );
    }

    // order no change event
    if (client) {
      client.on(
        "ticket.custom_field_" + defaultValues.ordernoFieldId + ".changed",
        function (_ordeno) {
          console.log("ticketId: ", ticketId);
          refreshAppInfo(ticketId, client, false)
          setKeyParam(_ordeno);
          console.log("here: ===> ", _ordeno);
        }
      );
    }
    
  };

  return (
    <div>
      <Script
        type="text/javascript"
        src="https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js"
        onLoad={() => {
          getRequester();
        }}
      />
       <div className="ez-card">        
          {!isLoading ? <UserInfoComponent userparam={keyParam} /> : ""}
      </div>
      {/* <div className="ez-card">
        <div className="ez-card-block pb-3">
          {isLoading ? (
            <p>Fetching user details...</p>
          ) : (
            <UserInfoComponent userparam={keyParam} />
          )}
          {isLoading ? (
            <p>Fetching order aggregates...</p>
          ) : (
            <OrderAggrigateComponent userparam={keyParam} />
          )}
        </div>
        {isLoading ? (
          <p>Fetching previous orders...</p>
        ) : (
          <PreviousOrdersComponent userparam={keyParam} />
        )}
      </div> */}
    </div>
  );
}
