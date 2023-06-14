import React, { useState, useRef, useEffect } from "react";
import { Tooltip, Grid, Link, Text, Button } from "@nextui-org/react";
import { defaultValues } from "../../constant";
import Chevron from "./Chevron";
import ExternalLink from "../fontawesomeIcons/ExternalLink";
// import "./Accordion.css";

function Accordion(props) {
  const [setActive, setActiveState] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const [setRotate, setRotateState] = useState("accordion__icon");

  const content = useRef(null);
  useEffect(() => {
    if (props.index == 0) {
      setActiveState("active");
      setHeightState(`${content.current.scrollHeight}px`);
      setRotateState("accordion__icon rotate");
    }
  }, []);

  function toggleAccordion() {
    setActiveState(setActive === "" ? "active" : "");
    setHeightState(
      setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
    );
    setRotateState(
      setActive === "active" ? "accordion__icon" : "accordion__icon rotate"
    );
  }

  return (
    <div className="accordion__section">
      <button className={`accordion ${setActive}`}>
        <Grid.Container gap={2} alignContent="center">
          <Grid css={{ dflex: "center" }}>
            <Tooltip
              content={"View in admin"}
              trigger="hover"
              color="primary"
              placement="right"
            >
              <Link
                className="accordion__title"
                target="_blank"
                href={defaultValues.order_url + props.orderid}
              >
                # {props.orderid}
                <ExternalLink width={15} height={15} fill={"#0072f5"} />
              </Link>
            </Tooltip>
          </Grid>
        </Grid.Container>
        <Chevron
          onClick={toggleAccordion}
          className={`${setRotate}`}
          width={10}
          fill={"#444"}
        />
      </button>
      <div
        ref={content}
        // style={{ minHeight: `${setHeight}` }}
        className="accordion__content"
      >
        <div className="card-body">
          <ul className="zend-listing list-unstyled">
            <li>
              <p className="mb-0">Created: {props.created}</p>
            </li>
            <li>
              <span className="fw-700">${props.total}</span>
            </li>
          </ul>
          <strong>{props.description}</strong>
          {/* <ul className="zend-listing list-unstyled">
                <li>
                  <p className="mb-0">Refund available</p>
                </li>
                <li></li>
              </ul> 
          */}
        </div>
      </div>
    </div>
  );
}

export default Accordion;
