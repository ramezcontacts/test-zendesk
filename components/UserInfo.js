import { useState, useEffect } from "react";
import { defaultValues } from "../constant";
import { endPoints } from "../constant/endpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Grid, Link, Text, Button } from "@nextui-org/react";
import FadeLoader from "./Loader/FadeLoader";
import { validateEmail } from "../utils/functions";
import NotFoundText from "../components/404/NotFoundText";
import dynamic from "next/dynamic";

export default function UserInfo({ userparam, shipmentParam, newTicket, zendeskClient }) {
  const [isLoading, setLoading] = useState(false);
  const [isOrderAggrLoading, setOrderAggrLoading] = useState(true);
  const [status404, setStatus404] = useState(false);
  const [shipment, setShipment] = useState(null);
  const [user, setUser] = useState({
    id: null,
    name: null,
    email: null,
  });
  const OrderAggrigateComponent = dynamic(() =>
    import("./OrderAggregate")
  );
  
  useEffect(() => {
    console.log({newTicket, zendeskClient});
    setLoading(true);
      userparam != null
        ? validateEmail(userparam)
          ? userInfoFromEmail(userparam)
          : userInfoFromOrderNO(userparam)
        : "";
  }, []);

  const userInfoFromOrderNO = async (orderno) => {
    try {
      const res = await fetch(endPoints.customer_details + orderno);
      const data = await res.json();

      if (data._404Status) {
        console.log("in 404");
        setStatus404(true);
        // temporarly commented
          // zendeskClient.set('ticket.requester', { name: '', email:'' }) ;
      } else if (!data.errorStatus) {
        setUser({
          id: data[0].user_id,
          name: data[0].name,
          email: data[0].email,
        });

        // temporarly commented
          // prefill requester with customer info (only in new ticket for lost package form.)
          // if( newTicket && zendeskClient !== undefined ){
          //   zendeskClient.get('ticket.form').then(function(form){
          //     if( form['ticket.form'].id === defaultValues.lostPackageFormId ){
          //       zendeskClient.set({'ticket.requester': {email:data[0].email, name:data[0].name}});
          //     }
          //   })
          // }

      } else {
      }
      setLoading(false);
      setOrderAggrLoading(false);
    } catch (err) {
      console.log("try catch error logs: =====> ", err);
    }
    return false;
  };

  const userInfoFromEmail = async (emal) => {
    try {
      const res = await fetch(endPoints.userdetails + emal);
      const data = await res.json();

      if (data._404Status) {
        setStatus404(true);
      } else if (!data.errorStatus) {
        setUser({
          id: data[0].user_id,
          name: data[0].name,
          email: data[0].email,
        });
      } else {
      }
      setLoading(false);
      setOrderAggrLoading(false);
    } catch (err) {
      console.log("try catch error logs: =====> ", err);
    }
    return false;
  };

  if (isLoading) return <FadeLoader size="10" color="#b5b5b5" />;
  if (status404) return <div className="pb-3"><NotFoundText /></div>;

  return (
    <>
      <div className="ez-card-block pb-3">
        <ul className="zend-listing list-unstyled">
          <li>
            <h5 className="mb-0">{user.name}</h5>
          </li>
          {user.name ? (
            <li className="mr-rit-20p">
              <Grid.Container gap={2} alignContent="center">
                <Grid css={{ dflex: "center" }}>
                  <Tooltip
                    content={"View in admin"}
                    trigger="hover"
                    color="primary"
                    placement="left"
                  >
                    <Link
                      target="_blank"
                      href={defaultValues.view_in_admin_url + user.id}
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
          ) : (
            ""
          )}
        </ul>

        <ul className="zend-listing list-unstyled user-paralled-info">
          <li>
            <small>{user.email}</small>
          </li>
          <li>
            <small>{user.id}</small>
          </li>
        </ul>
      </div>
      {!isOrderAggrLoading ? (
        <OrderAggrigateComponent userparam={userparam} shipmentParam={shipmentParam} />
      ) : (
        ""
      )}
    </>
  );
}
