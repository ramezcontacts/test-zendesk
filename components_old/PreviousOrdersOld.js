import { defaultValues } from "../constant";
import React from "react";
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

export default function PreviousOrders({ orders, _loader_ }) {
  return (
    <>
      <div className="ez-card-block">
        {_loader_ ? (
          <center>
            <small></small>
          </center>
        ) : (
          <Accordion allowZeroExpanded preExpanded={[0]}>
            {orders.length > 0 ? (
              orders.map((orderData, index) => {
                return (
                  <>
                    <AccordionItem key={"item" + orderData.id} uuid={index}>
                      <AccordionItemHeading key={"heading" + orderData.id}>
                        <AccordionItemButton key={"btn" + orderData.id}>
                          <a
                            target="_blank"
                            data-href={defaultValues.order_url + orderData.id}
                          >
                            <span className="mr-rit-10p">
                              #&nbsp;{orderData.id}
                            </span>
                          </a>

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
                                ${ commaSeparated( orderData.total ) } 
                              </span>
                            </li>
                          </ul>
                          <strong>{orderData.status.description}</strong>
                          {/* <ul className="zend-listing list-unstyled">
                            <li>
                              <p className="mb-0">Refund available</p>
                            </li>
                            <li></li>
                          </ul> */}
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
        )}
      </div>
    </>
  );
}
