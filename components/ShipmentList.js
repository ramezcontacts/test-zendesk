import { useState, useEffect } from "react";
import { defaultValues } from "../constant";
import { endPoints } from "../constant/endpoints";
import React from "react";
import FadeLoader from "./Loader/FadeLoader";
import { Tooltip, Grid, Link, Text, Button } from "@nextui-org/react";
import PasteLight from "./fontawesomeIcons/PasteLight";
import { filterCarrierName, formatOrderDate, updateShipmentDetails } from "../utils/functions";

export default function ShipmentList({ shipmentParam }) {
  const [isLoading, setLoading] = useState(true);
  const [status404, setStatus404] = useState(false);
  const [order, setOrder] = useState([]);
  const [shipment, setShipment] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (Array.isArray(shipmentParam)) {
      const filteredShipItems = shipmentParam
        .slice(0, 0)
        .concat(shipmentParam.slice(0 + 1, shipmentParam.length));

      setShipment(filteredShipItems);
    } else if (shipmentParam._404Status) {
      setStatus404(true)
    }
    setLoading(false);
  }, []);

  function updateShipmentDeatils(ship_tracking_number, name, description, status_updated_date) {
    //var client = ZAFClient.init();
    updateShipmentDetails( ZAFClient.init(), filterCarrierName(name), ship_tracking_number, status_updated_date, description )

    // console.log({
    //   client: client,
    //   ship_tracking_number: ship_tracking_number,
    //   name: name,
    // });
  }

  if (isLoading) return <FadeLoader size="10" color="#b5b5b5" />;
  if (status404) return <div className="ez-card-block pb-3">
  <div className="ez-card-block recent-order mt-2">
    <h5>Shipment List</h5>
  </div>
  <div className="ez-card-block brder-top-custom">
    <center className="mt-10px"><small>No shipment was found</small></center>
  </div>
</div>;

  if (shipment.length)
    return (
      <>
        <div className="ez-card-block pb-3">
          <div className="ez-card-block recent-order mt-2">
            <h5>Shipment List</h5>
          </div>
          <div className="ez-card-block">
            {shipment
              ? shipment.map((shipment, index) => {
                  return (
                    <div
                      key={"main_" + index}
                      className={"accordion__section accrodion_no_" + index}
                    >
                      <section className="accordion pad5x0 cursor-d">
                        <div class="accordion__title color-gray">
                          {shipment.name} - {shipment.ship_tracking_number}
                        </div>

                        <div
                          className="tooltip-container"
                          onClick={() =>
                            updateShipmentDeatils(
                              shipment.ship_tracking_number,
                              shipment.name,
                              shipment.status_description,
                              shipment.status_updated
                            )
                          }
                        >
                          <Tooltip
                            content={"Autofill this shipment"}
                            trigger="hover"
                            color="primary"
                            placement="left"
                          >
                            <PasteLight
                              className="cursor-p"
                              width={15}
                              height={15}
                              fill={"#0072f5"}
                            />
                          </Tooltip>
                        </div>
                      </section>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
      </>
    );
}
