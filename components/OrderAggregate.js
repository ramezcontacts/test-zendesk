import { useState, useEffect } from "react";
import { endPoints } from "../constant/endpoints";
import { commaSeparated } from "../utils/functions";

import { validateEmail } from "../utils/functions";
import FadeLoader from "./Loader/FadeLoader";
import dynamic from "next/dynamic";

export default function OrderAggregate({ userparam, shipmentParam }) {
  const [isLoading, setLoading] = useState(false);
  const [isPrevOrdersLoading, setPrevOrdersLoading] = useState(false)
  const [status404, setStatus404] = useState(true);
  const [order, setOrder] = useState([]);
  const [shipment, setShipment] = useState(null);

  const ShimentListComponent = dynamic(() => import("../components/ShipmentList"));
  const PreviousOrdersComponent = dynamic(() => import("./PreviousOrders"));

  useEffect(() => {
    setLoading(true);
    userparam != null
      ? validateEmail(userparam)
        ? aggregateFromEmail(userparam)
        : aggregateFromOrderNO(userparam)
      : "";
      setShipment( shipmentParam );
      // if ( Array.isArray(shipmentParam) ){
      // } else {
      //   console.log("hre in sip compionn : ", shipmentParam)
      // }
  }, []);

  const aggregateFromOrderNO = async (orderno) => {
    try {
      const res = await fetch(
        endPoints.orders_aggregates_from_orderno + orderno
      );
      const data = await res.json();

      if (data._404Status) {
      } else if (!data.errorStatus) {
        setOrder(data);
        if (data[0].totalOrderCount > 0 || data[0].totalAmount > 0) {
          setStatus404(false);
        }
      } else {
      }
      setLoading(false);
      setPrevOrdersLoading(false);
    } catch (err) {
      console.log("try catch error logs: =====> ", err);
    }
    return false;
  };

  const aggregateFromEmail = async (emal) => {
    try {
      const res = await fetch(endPoints.orders_aggregates + emal);
      const data = await res.json();

      if (data._404Status) {
      } else if (!data.errorStatus) {
        setOrder(data);
        if (data[0].totalOrderCount > 0 || data[0].totalAmount > 0) {
          setStatus404(false);
        }
      } else {
      }
      setLoading(false);
      setPrevOrdersLoading(false);
    } catch (err) {
      console.log("try catch error logs: =====> ", err);
    }
    return false;
  };


  if (isLoading) return <FadeLoader size="10" color="#b5b5b5" />;
  if (!status404)
    return (
      <>
        <div className="ez-card-block pb-3">
          <div className="zend-display-block">
            <div className="zend-display-wrap">
              <p>Total orders:</p>
              <span className="fw-700">{order[0].totalOrderCount}</span>
            </div>
            <div className="zend-display-wrap">
              <p>Total amount spent:</p>
              <span className="fw-700">
                {"$" + commaSeparated(order[0].totalAmount)}
              </span>
            </div>
          </div>
        </div>
        {
        shipment != null ? (
          <ShimentListComponent shipmentParam={shipment} />
        ):("")
      }
        {!isPrevOrdersLoading ? (
          <PreviousOrdersComponent userparam={userparam} />
        ) : (
          ""
        )}
      </>
    );
}
