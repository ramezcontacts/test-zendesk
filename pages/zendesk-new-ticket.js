import { useState, useEffect } from "react";
import React from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import { endPoints } from "../constant/endpoints";
import { defaultValues } from "../constant";
import useStorage from "../hooks/useStorage.ts";
import { Tooltip, Grid, Link, Text, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { updateOrderNo, updateShipmentDetails, filterCarrierName, formatOrderDate, formatTicketDate, getRequesterProfileURL } from "../utils/functions";
import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons";

const { getItem } = useStorage();
const { setItem } = useStorage();
var client;
export default function Home() {
  useEffect(() => {
    setItem("last-order-no", null);
  }, []);

  let lastOrderNo = null, isLostPacakgeForm = false;
  const [keyParam, setKeyParam] = useState(null);
  const [shipmentListParam, setShipmentListParam] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [ticketCounts, setTicketCounts] = useState(0);
  const [ticketRecentUpdate, setTicketRecentUpdate] = useState(null);
  const [ticketCountsLoader, setTicketCountsLoader] = useState(false);
  const [requesterId, setRequesterId] = useState(0);

  const UserInfoComponent = dynamic(() => import("../components/UserInfo"));


  const getRequester = async () => {
    client = ZAFClient.init();
    client.invoke("resize", { width: "100%", height: "600px" });

    console.log("client", client)


    if (client) {
      // order no change event.
      client.on(
        "ticket.custom_field_" + defaultValues.ordernoFieldId + ".changed",
        function (_ordeno) {
          console.log({ _ordeno })
          updateShipmentDetails(client); // updating to null
          setKeyParam(_ordeno);
          setShipmentListParam(null);
          setItem("last-order-no", _ordeno);

          client
            .get([
              "ticket.customField:custom_field_" +
              defaultValues.trackingNoFieldId,
              "ticket.customField:custom_field_" + defaultValues.carrierFieldId,
            ])
            .then(function (_data) {
              var carrierFieldId =
                _data["ticket.customField:custom_field_" + defaultValues.carrierFieldId];

              var trackingNoFieldId =
                _data[
                "ticket.customField:custom_field_" +
                defaultValues.trackingNoFieldId
                ];

              (isLostPacakgeForm)
                ? getTrackingInfo(
                  _ordeno,
                  client,
                  carrierFieldId,
                  trackingNoFieldId
                )
                : false;
              /*
              !carrierFieldId || !trackingNoFieldId
                ? getTrackingInfo(
                    _ordeno,
                    client,
                    carrierFieldId,
                    trackingNoFieldId
                  )
                : console.log("in else part");
                */
            });
        }
      );

      // requester change event.
      client.on("ticket.requester.email.changed", function (_email) {
        setTicketCountsLoader(true);
        client.get("ticket").then(function (_data) {
          console.log({ _data })
          _data["ticket"].form.id == defaultValues.defaultTicketForm
            ? setKeyParam(_email)
            : console.log("different form id");

          // fething interactions count
          var settings = {
            url: endPoints.zendesk.previous_conversation + _data.ticket.requester.id + '/tickets/requested?sort_by=updated_at&sort_order=desc',
            headers: { "Authorization": "Basic aWFtd2ViZ3VydTVAZ21haWwuY29tOklhbXdlYmd1cnU1QDIwMjI=" },
            secure: true,
            type: 'GET',
            contentType: 'application/json',
          };

          client.request(settings).then(function (ticketData) {
            console.log("ticketData ===> ", ticketData);
            console.log("count ticketData ===> ", ticketData.tickets.length);
            setTicketCounts(ticketData.tickets.length);
            setTicketRecentUpdate(ticketData.tickets[0].updated_at);
            setTicketCountsLoader(false)
            setRequesterId(_data.ticket.requester.id)
            //perviousConversation(ticketData.tickets);
          }).catch(function (error) {
            console.log("errors ===>", error.toString());
            setTicketCountsLoader(false)
          });
        });
      });

      // form change event
      client.on("ticket.form.id.changed", function (id) {
        updateOrderNo(client)
        if (id == defaultValues.defaultTicketForm) {

          client.get("ticket").then(function (_data) {
            _data["ticket"].requester
              ? setKeyParam(_data["ticket"].requester.email)
              : false;
          });
        } else {
          // updateOrderNo(client)          
          if (parseInt(getItem("last-order-no"))) {
            if (id == defaultValues.lostPackageFormId) {
              isLostPacakgeForm = true;
            }
            updateOrderNo(client, parseInt(getItem("last-order-no")));
          }

          if (id == defaultValues.lostPackageFormId) {
            isLostPacakgeForm = true;
          } else {
            isLostPacakgeForm = false;
            setShipmentListParam(null);
          }
        }
      });
      // END of form change event
    }
  };

  const getTrackingInfo = async (
    orderNo,
    client,
    carrierFieldId,
    trackingNoFieldId
  ) => {
    try {

      const res = await fetch(endPoints.get_tracking_info + orderNo);
      const data = await res.json();

      setShipmentListParam(data);
      if (data._404Status) {

        updateShipmentDetails(client);
        return { status: "404" };
      } else if (!data.errorStatus) {
        if (data[0].multiple == false) {

          /*!trackingNoFieldId
            ? client.set(
                "ticket.customField:custom_field_" +
                  defaultValues.trackingNoFieldId,
                data[1].ship_tracking_number
              )
            : console.log("trackingNoFieldId ==> else");
          !carrierFieldId
            ? client.set(
                "ticket.customField:custom_field_" +
                  defaultValues.carrierFieldId,
                data[1].name.toLowerCase()
              )
            : console.log("carrierFieldId ==> else");
            */

          updateShipmentDetails(
            client,
            filterCarrierName(data[1].name).toLowerCase(),
            data[1].ship_tracking_number,
            (data[1].status_updated) ? data[1].status_updated : null,
            (data[1].status_description) ? data[1].status_description : "",

          )
        } else if (data[0].multiple == true) {
          //setShipmentListParam(data);
          console.log(data[0]);

          updateShipmentDetails(client);
        }
      } else {
        updateShipmentDetails(client);
        return { status: "else" };
      }
    } catch (err) {
      return { status: err };
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
        {keyParam !== null ? <UserInfoComponent newTicket={true} userparam={keyParam} shipmentParam={shipmentListParam} zendeskClient={client} /> : ""}

        {ticketCounts > 0 ?
          <div className="interactions ez-card-block pb-3">
            {/* <div className="ez-card-block recent-order mt-2">
              <h5>Interactions</h5>
            </div> */}
            <div className="ez-card-block pb-3">
              <ul className="zend-listing list-unstyled interations-info-listing">
                <li>
                  <span>Total Interactions:</span>
                  <span className="ml-10 fw-700">
                    {
                      ticketCountsLoader ? <small>loading...</small> : ticketCounts
                    }
                  </span>

                </li>
                <li>
                  <span>Recent updated on:</span>
                  <span className="ml-10 fw-700">
                    {
                      ticketCountsLoader ? <small>loading...</small> : formatTicketDate(ticketRecentUpdate)
                    }
                  </span>

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
                      href={() => false}
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
              </Grid.Container> </li>
               */}
              </ul>
            </div>
          </div>
          : ''}

      </div>
    </div>
  );
}
