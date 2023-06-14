import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { endPoints } from "../constant/endpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Grid, Link, Text, Button } from "@nextui-org/react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import { defaultValues } from "../constant";

let _loader = false,
  userSearchResultsNodata = false;
export default function LostPackageClaim({ orderno }) {
  const [orderDetailsData, setOrderDetailsData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    orderDetails(orderno);
  }, []);

  // orderDetails(orderno);
  const [userSearchResults, setUserSearchResults] = useState([]);

  const orderDetails = async (orderno) => {
    _loader = true;

    const _url = endPoints.lost_order_details + orderno;

    const response = await fetch(_url);
    const data = await response.json();

    
    if (data.message == "Not Found" || data.size == 0) {
      //setLoading(false)
    } else {
      setOrderDetailsData(data);
      setLoading(false);
      //  console.log("orderDetailsData: ", orderDetailsData)
    }
    //_loader = false;
    return false;
  };

  function formatOrderDate(createdDate) {
    const _date = new Date(createdDate);
    return _date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  }
  if (isLoading) return <p>Fetching order details...</p>;
  if (!orderDetailsData) return <p>Order details not found</p>;

  return (
    <>
      <div className="ez-card-block pb-3">
        <div className="zend-display-block">
          <div className="zend-display-wrap">
            <p>Order number:</p>
            <span className="fw-700">{orderno}</span>
          </div>
          <div className="zend-display-wrap">
            <p>Customer name:</p>
            <span className="fw-700">{orderDetailsData.username}</span>
          </div>
          <div className="zend-display-wrap">
            <p>Custoemr ID:</p>
            <span className="fw-700">{orderDetailsData.user_id}</span>
          </div>
          <div className="zend-display-wrap">
            <p>Custoemr email:</p>
            <span className="fw-700">{orderDetailsData.email}</span>
          </div>
        </div>
      </div>
      <Accordion preExpanded={[0]}>
        <AccordionItem key={"item" + orderDetailsData.id} uuid={0}>
          <AccordionItemHeading key={"heading" + orderDetailsData.id}>
            <AccordionItemButton key={"btn" + orderDetailsData.id}>
              <a
                href="#"
                data-href={defaultValues.order_url + orderDetailsData.id}
              >
                <span className="mr-rit-10p">#&nbsp;{orderDetailsData.id}</span>
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
                      href={defaultValues.order_url + orderDetailsData.id}
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
          <AccordionItemPanel key={"panel" + orderDetailsData.id}>
            <div className="card-body" key={"div" + orderDetailsData.id}>
              <ul
                className="zend-listing list-unstyled"
                key={"ul1" + orderDetailsData.id}
              >
                <li>
                  <p className="mb-0">
                    Created: {formatOrderDate(orderDetailsData.created)}
                  </p>
                </li>
                <li>
                  <span className="fw-700">${orderDetailsData.total} USD</span>
                </li>
              </ul>
              <strong>{orderDetailsData.status.description}</strong>
              {/* <ul className="zend-listing list-unstyled">
                <li>
                  <p className="mb-0">Refund available</p>
                </li>
                <li></li>
              </ul> */}
            </div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}