/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Script from "next/script";
import { Tooltip, Grid, Link, Text, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";

import { endPoints } from "../constant/endpoints";
import { defaultValues } from "../constant";
import React from "react";
import { getRequesterProfileURL, formatTicketDate } from "../utils/functions";
let envType, ticketId;
var client;
export default function Home() {
  envType = defaultValues.environment_type;
  console.log("App render");

  const [keyParam, setKeyParam] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState([]);
  const [ticketCounts, setTicketCounts] = useState(0);
  const [ticketRecentUpdate, setTicketRecentUpdate] = useState(null);
  const [currentTicketId, setCurrentTicketId] = useState(0);
  const [requesterId, setRequesterId] = useState(0);
  // const [ticketId, setTicketId] = useState(null)

  const UserInfoComponent = dynamic(() => import("../components/UserInfo"));

  function refreshAppInfo(_ticketId, client, isInit, requesterEmail = "") {
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

      const orderno = customFields[index].value;

      if (orderno != null && orderno) {
        console.log(" ==>  here in orderno");
        if (isInit) {
          setKeyParam(orderno);
        }
        setLoading(false);
      } else {
        console.log("here in email");
        if (isInit) {
          setKeyParam(requesterEmail);
        }
        setLoading(false);
      }
    });
  }

  const getRequester = async () => {
    client = ZAFClient.init();
    client.invoke("resize", { width: "100%", height: "600px" });
    const requester = await client.get("ticket");
    ticketId = requester["ticket"].id;

    if (requester["ticket"].form.id) {
      refreshAppInfo(
        requester["ticket"].id,
        client,
        true,
        requester["ticket"].requester.email
      );
    }

    // order no change event
    if (client) {
      client.on(
        "ticket.custom_field_" + defaultValues.ordernoFieldId + ".changed",
        function (_ordeno) {
          refreshAppInfo(ticketId, client, false);
          setKeyParam(_ordeno);
        }
      );
    }

    const _requester = await client.get("ticket.requester");
    const _ticket = await client.get("ticket");
    console.log("===> ", _requester);
    console.log("===> ", _ticket.ticket.id);

    if( _ticket ){
      setCurrentTicketId(_ticket.ticket.id)
    }

    var settings = {
      url: endPoints.zendesk.previous_conversation+_requester['ticket.requester'].id+'/tickets/requested?sort_by=created_at&sort_order=desc',
      headers: {"Authorization": "Basic aWFtd2ViZ3VydTVAZ21haWwuY29tOklhbXdlYmd1cnU1QDIwMjI="},
      secure: true,
      type: 'GET',
      contentType: 'application/json',
    };

    client.request(settings).then(function(ticketData) {
      console.log("ticketData ===> ", ticketData);
      console.log("count ticketData ===> ", ticketData.tickets.length);
      setTicketCounts(ticketData.tickets.length);
      setTicketRecentUpdate(ticketData.tickets[0].updated_at);
      setRequesterId(_requester['ticket.requester'].id)
      //perviousConversation(ticketData.tickets);
    }).catch(function(error) {
      console.log("errors ===>", error.toString()); 
    });

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
        {!isLoading ? <UserInfoComponent newTicket={false} userparam={keyParam} /> : ""}
        {ticketCounts > 0  ? 
        <div className="interactions ez-card-block pb-3">
            {/* <div className="ez-card-block recent-order mt-2">
              <h5>Interactions</h5>
            </div> */}
          <div className="ez-card-block pb-3">
            <ul className=" zend-listing list-unstyled interations-info-listing">
              <li>
                <span>Total Interactions:</span><span className="ml-10 fw-700">{ticketCounts}</span>
              </li>
              <li>
                <span>Recent updated on:</span><span className="ml-10 fw-700">{formatTicketDate(ticketRecentUpdate)}</span>
              </li>
              {/*
              <li className="mr-rit-20p">
               <Grid.Container gap={2} alignContent="center">
                <Grid css={{ dflex: "center" }}>
                  <Tooltip
                    content={"Go to profile"}
                    trigger="hover"
                    color="primary"
                    placement="left"
                  >
                    <Link
                      target="_blank"
                      onClick={()=> client.invoke('routeTo', 'user', requesterId)}
                    >
                      <Text b color="primary">
                        <FontAwesomeIcon
                          icon={faExternalLink}
                          className="fa fa-external-link"
                        ></FontAwesomeIcon>
                      </Text>
                    </Link>
                  </Tooltip>
                </Grid>
              </Grid.Container> 
            </li>
              */}
            </ul>
          </div>
        </div>
        :''}
      </div>
    </div>
  );
}
