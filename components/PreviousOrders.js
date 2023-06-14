import { useState, useEffect } from "react";
import { defaultValues } from "../constant";
import { endPoints } from "../constant/endpoints";
import React from "react";

import { validateEmail } from "../utils/functions";
import { formatOrderDate, commaSeparated } from "../utils/functions";
import FadeLoader from "./Loader/FadeLoader";

import ReactDOM from "react-dom";
import AccordionNew from "../components/accordion/Accordion";

export default function PreviousOrders({ userparam }) {
  const [isLoading, setLoading] = useState(true);
  const [status404, setStatus404] = useState(false);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    setLoading(true);
    userparam != null
      ? validateEmail(userparam)
        ? previousOrdersFromEmail(userparam)
        : previousOrdersFromOrderNO(userparam)
      : "";
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

  if (isLoading) return <FadeLoader size="10" color="#b5b5b5" />;

  if (order.length)
    return (
      <>
        <div className="ez-card-block pb-3">
          <div className="ez-card-block recent-order mt-2">
            <h5>Recent Orders</h5>
          </div>
          <div className="ez-card-block">
            {order ? (
              order.map((orderData, index) => {
                return (
                  <>
                    <AccordionNew
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
        </div>
      </>
    );
}
