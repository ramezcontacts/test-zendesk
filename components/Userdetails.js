import { defaultValues } from "../constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Grid, Link, Text, Button } from "@nextui-org/react";
import {commaSeparated} from '../utils/functions'

export default function Userdetails({ user, orderAggr, loaidingState }) {
  return (
    <>
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
      
      {orderAggr.length ? (
        <div className="zend-display-block">
          <div className="zend-display-wrap">
            <p>Total orders:</p>
            <span className="fw-700">{orderAggr[0].totalOrderCount}</span>
          </div>
          <div className="zend-display-wrap">
            <p>Total amount spent:</p>
            <span className="fw-700">{"$" + commaSeparated( orderAggr[0].totalAmount )}</span>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
