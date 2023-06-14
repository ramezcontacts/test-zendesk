import { useState, useEffect } from "react";
import { endPoints } from "../constant/endpoints";
import { commaSeparated } from "../utils/functions";
import Loader from "../components/Loader";
import { validateEmail } from "../utils/functions";

export default function OrderAggregate({ userparam }) {
  const [isLoading, setLoading] = useState(false);
  const [status404, setStatus404] = useState(true);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    setLoading(true);

    userparam != null
      ? validateEmail(userparam)
        ? aggregateFromEmail(userparam)
        : aggregateFromOrderNO(userparam)
      : "";
    setLoading(false);
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
    } catch (err) {
      console.log("try catch error logs: =====> ", err);
    }
    return false;
  };

  if (isLoading) return <Loader />;

  if (!status404)
    return (
      <>
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
      </>
    );
}
