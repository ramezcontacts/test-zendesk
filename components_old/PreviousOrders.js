import { useState, useEffect } from "react";
import { defaultValues } from "../constant";
import { endPoints } from "../constant/endpoints";
import React from "react";
import Loader from "../components/Loader";
import NotFoundText from "../components/404/NotFoundText";
import { validateEmail } from "../utils/functions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Grid, Link, Text, Button } from "@nextui-org/react";
import { formatOrderDate, commaSeparated } from "../utils/functions";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

import ReactDOM from "react-dom";
import AccordionNew from "../components/accordion/Accordion";

export default function PreviousOrders({ userparam }) {
  const [isLoading, setLoading] = useState(false);
  const [status404, setStatus404] = useState(false);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    setLoading(true);

    userparam != null
      ? validateEmail(userparam)
        ? previousOrdersFromEmail(userparam)
        : previousOrdersFromOrderNO(userparam)
      : "";
    setLoading(false);
  }, []);

  const previousOrdersFromOrderNO = async (orderno) => {
    try {
      const res = await fetch(endPoints.peviousorders_from_order_no + orderno);
      const data = await res.json();

      if (data._404Status) {
        setStatus404(true);
      } else if (!data.errorStatus) {
        setOrder(data);
      } else {
      }
      setLoading(false);
    } catch (err) {
      console.log("try catch error logs: =====> ", err);
    }
    return false;
  };

  const previousOrdersFromEmail = async (emal) => {
    try {
      const res = await fetch(endPoints.peviousorders + emal);
      const data = await res.json();

      if (data._404Status) {
        setStatus404(true);
      } else if (!data.errorStatus) {
        setOrder(data);
      } else {
      }
      setLoading(false);
    } catch (err) {
      console.log("try catch error logs: =====> ", err);
    }
    return false;
  };

  if (isLoading) return <Loader />;

  if (order.length)
    return (
      <>
        <div className="ez-card-block recent-order mt-2">
          <h5>Recent Orders</h5>
        </div>
        {/* <div className="ez-card-block">
          <Accordion allowZeroExpanded preExpanded={[0]}>
            {order.length > 0 ? (
              order.map((orderData, index) => {
                return (
                  <>
                    <AccordionItem key={"item" + orderData.id} uuid={index}>
                      <AccordionItemHeading key={"heading" + orderData.id}>
                        <AccordionItemButton key={"btn" + orderData.id}>
                          <Grid.Container gap={2} alignContent="center">
                            <Grid css={{ dflex: "center" }}>
                              <Tooltip
                                content={"View in admin"}
                                trigger="hover"
                                color="primary"
                                placement="right"
                              >
                                <Link
                                  target="_blank"
                                  href={defaultValues.order_url + orderData.id}
                                >
                                  <span className="mr-rit-10p">
                                    #&nbsp;{orderData.id}
                                  </span>
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
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel key={"panel" + orderData.id}>
                        <div className="card-body" key={"div" + orderData.id}>
                          <ul
                            className="zend-listing list-unstyled"
                            key={"ul1" + orderData.id}
                          >
                            <li>
                              <p className="mb-0">
                                Created: {formatOrderDate(orderData.created)}
                              </p>
                            </li>
                            <li>
                              <span className="fw-700">
                                ${commaSeparated(orderData.total)}
                              </span>
                            </li>
                          </ul>
                          <strong>{orderData.status.description}</strong>
                          
                        </div>
                      </AccordionItemPanel>
                    </AccordionItem>
                  </>
                );
              })
            ) : (
              <center>
                <small></small>
              </center>
            )}
          </Accordion>
        </div> */}
        <div className="ez-card-block">
          {order ? (
            order.map((orderData, index) => {
              return (
                <>
                  <AccordionNew
                    key={index}
                    firstItem={index}
                    index={index}
                    orderid={orderData.id}
                    created={formatOrderDate(orderData.created)}
                    total={commaSeparated(orderData.total)}
                    description={orderData.status.description}
                  />
                </>
              );
            })
          ) : (
            <center>
              <small></small>
            </center>
          )}
        </div>
      </>
    );
}
