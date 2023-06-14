/* eslint-disable @next/next/no-img-element */
import { useForm } from "react-hook-form";
import { useState } from "react";
import Script from "next/script";

import dynamic from "next/dynamic";
import UserDetailComponent from "../components/Userdetails";
import PreviousOrdersComponent from "../components/PreviousOrders";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { endPoints } from "../constant/endpoints";
import { defaultValues } from "../constant";
import useStorage from "../hooks/useStorage.ts";
import React from "react";

const { searchResults = [] } = [];
const { getItem } = useStorage();
const { setItem } = useStorage();
let baseurl,
  envType,
  _searchQuery,
  _loader = false,
  _loadOrder = false,
  orderAgrLoader = false,
  userApiLoadingState = true;
// console.log("defaultValues: ", defaultValues.`{environment_type}`.baseUrl);

// export async function getServerSideProps(context) {
//   const session =  await getSession(context)

// console.log("accountEndPoint in async: ", accountEndPoint);
// const response = await fetch(accountEndPoint.baseUrl+accountEndPoint.account,{
//                     method: 'get',
//                     headers: new Headers({
//                       'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiaWFtd2ViZ3VydTUiLCJpYXQiOjE2NTc2OTUyNzUsImV4cCI6MTY1Nzc4MTY3NX0.UnfLXfJAIyjp1vDNnwM9gn3WMGCm5h6V9RuYPYnrPOc',
//                     }),
//                 })
// const _app_data = await response.json()

// console.log(response);

//   return {
//     props: {
//       // _app_data,
//       _app_data : session ? 'Auth user':'Guest user',
//     },
//   }
// }

export default function Home({ _app_data }) {
  envType = defaultValues.environment_type;

  const [userSearchResults, setUserSearchResults] = useState([]);
  const [zafobj, setZafobj] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [keyParam, setKeyParam] = useState(null);
  const [userName, setUserName] = useState(null);
  const [requesterName, setRequesterName] = useState(null);
  const [accountId, setAccountId] = useState(0);
  const [reqData, setReqData] = useState({});
  const [recentOder, setRecentOder] = useState({
    id: null,
    price: null,
    date: null,
    status: null,
    timeSinceOrder: null,
  });

  const [userDetail, setUserDetail] = useState({
    id: null,
    name: null,
    email: null,
  });

  const [orderAggrigates, setOrderAggrigates] = useState([]);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [orderNumber, setOrderNumber] = useState(null);
  const [previousTickets, setPreviousTickets] = useState([]);
  const validationSchema = Yup.object().shape({
    searchQuery: Yup.string().required("This field is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  // console.log(userSearchResults.length)
  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;
  function resetFunction() {
    setUserSearchResults([]);
    reset();
  }
  const [isLoading, setLoading] = useState(false);
  const UserInfoComponent = dynamic(() => import("../components/UserInfo"));

  function requesterData(data) {
    //setUserEmail(data.email);
    //setUserName(data.name);
    // setReqData(data);
    getOrderAggrgates(data.email);
    getOrder(data.email);
  }

  function perviousConversation(ticketData) {
    setPreviousTickets(ticketData);
  }

  function getUrl(environment_type) {
    switch (environment_type) {
      case "local":
        return defaultValues.local.baseurl;
        break;
      case "staging":
        return defaultValues.staging.baseurl;
        break;
      case "production":
        return defaultValues.production.baseurl;
        break;
      default:
        return "";
    }
  }

  const getUserDetail = async (email) => {
    try {
      console.log("here in getUserDetails: ", email)
      const res = await fetch(endPoints.userdetails + email);
      const data = await res.json();

      // console.log("getUserDetail: ", data)
      if (data._404Status) {
        userApiLoadingState = false;
      } else if (!data.errorStatus) {
        setUserDetail({
          id: data[0].user_id,
          name: data[0].name,
          email: data[0].email,
        });
        userApiLoadingState = false;
      } else {
      }
    } catch (err) {
      //console.log("try catch error logs: ",err);
    }
    return false;
  };
  const getCustomerDetails = async (orderno) => {
    try {
      //console.log("here in getCustomerDetails: ", orderno)
      const res = await fetch(endPoints.customer_details + orderno);
      const data = await res.json();

     // console.log("getCustomerDetails: ", data)
      if (data._404Status) {
        userApiLoadingState = false;
      } else if (!data.errorStatus) {
        setUserDetail({
          id: data[0].user_id,
          name: data[0].name,
          email: data[0].email,
        });
        userApiLoadingState = false;
      } else {
      }
    } catch (err) {
      //console.log("try catch error logs: ",err);
    }
    return false;
  };

  const getOrderAggrgates = async (email) => {
    try {
      orderAgrLoader = true;
      const res = await fetch(endPoints.orders_aggregates + email);
      const data = await res.json();

      if (data._404Status) {
        // orderAgrLoader = false;
      } else if (!data.errorStatus) {
        orderAgrLoader = false;
        setOrderAggrigates(data);
      } else {
        // orderAgrLoader = false;
      }
    } catch (err) {
      orderAgrLoader = false;
      //console.log("try catch error logs: ",err);
    }
    return false;
  };
  const getOrderDetials = async (orderno) => {
    try {
     // console.log("order no: ==> ", orderno)
      orderAgrLoader = true;
      const res = await fetch(endPoints.lost_order_details + orderno);
      const data = await res.json();
    //  console.log("order details: ==> ", data)

      if (data._404Status) {
        // orderAgrLoader = false;
      } else if (!data.errorStatus) {
      //  console.log("order details: ==> ", data)
      } else {
        // orderAgrLoader = false;
      }
    } catch (err) {
      orderAgrLoader = false;
      //console.log("try catch error logs: ",err);
    }
    return false;
  };

  const getOrder = async (email) => {
    _loadOrder = true;
    try {
      /*
      const res = await fetch(endPoints.order + email);
      const data = await res.json();

      //console.log("this case: ", data)
      if (data._404Status) {
        // console.log("this case ==>: ", data);
        _loadOrder = false;
        // console.log("_loadOrder: ==>: ", _loadOrder);
        // return false;
      } else if (!data.errorStatus) {
        const _date = new Date(data.created);
        const formattedDate = _date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        recentOder.id = data.id;
        const today = new Date();
        const _days = dateDiff(data.created, today).d;
        setRecentOder({
          id: data.id,
          price: "$ " + data.total,
          date: formattedDate,
          status: data.status.description,
          timeSinceOrder: _days + " days",
        });

        var today = new Date();
        var previousDate = formattedDate;
        var diffMs = today - previousDate;
        var diffDays = Math.floor(diffMs / 86400000); //

        // console.log("todayFormattedDate ======> : ",dateDiff(data.created, today ).d );
        // console.log("ordre price ======> : ", data.total);
        // console.log("ordre date ======> : ", data.created);
        // console.log("ordre time since order ======> : ", data.created);
        // console.log("ordre status ======> : ", data.status.description);
        // console.log("recentOder: ",recentOder)
        _loadOrder = false;
      } else {
        _loadOrder = false;
        //console.log("Getting error while fetching data.", data);
      }
      */
      const resPrevousOrder = await fetch(endPoints.peviousorders + email);
      const dataPrevousOrder = await resPrevousOrder.json();
      previousOrderData(dataPrevousOrder);

      // console.log("previousOrders: ", previousOrders);
    } catch (err) {
      _loadOrder = false;
      // console.log("try catch error logs: ",err);
    }
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

  function timeSinceOrder(createdDate) {
    return dateDiff(createdDate, new Date()).d;
  }

  function dateDiff(str1, str2) {
    var diff = Date.parse(str2) - Date.parse(str1);
    return isNaN(diff)
      ? NaN
      : {
          diff: diff,
          ms: Math.floor(diff % 1000),
          s: Math.floor((diff / 1000) % 60),
          m: Math.floor((diff / 60000) % 60),
          h: Math.floor((diff / 3600000) % 24),
          d: Math.floor(diff / 86400000),
        };
  }

  function previousOrderData(recentOderData) {
    //console.log(typeof recentOderData);
    if (recentOderData._404Status) {
      setPreviousOrders([]);
    } else if (!recentOderData.errorStatus) {
      setPreviousOrders(recentOderData);
    } else {
      setPreviousOrders([]);
    }
  }

  const getRequester = async () => {
    /* --------------- exprimental -------------
       getting authtoken
    */
      /*
      let authToken = getItem("token");
      if (authToken === "undefined" || authToken === undefined) {
        const token = await fetch(endPoints.login);
        const data = await token.json();
        if (data.access_token == "false" || data.access_token == false) {
          // console.log("unquthorized");
        } else {
          //console.log("authrized");
          const setToken = setItem("token", data.access_token);
          authToken = data.access_token;
        }
      } else {

      }
      */
    /* ---------  exprimental -------------  
          end of getting authToken 
    */

    var client = ZAFClient.init();
    client.invoke("resize", { width: "100%", height: "400px" });
    const requester = await client.get("ticket");

    // customer inquiry form
    if ( requester["ticket"].form.id ==  defaultValues.CustInquiryformId ) {
      var ticketData = {
        url: endPoints.zendesk.tickets+requester["ticket"].id,
        type: 'GET',
        dataType: 'json'
      };

      client.request(ticketData).then(function(data) {
        let customFields = data.ticket.custom_fields;
        const index = customFields.findIndex(x => x.id ===  defaultValues.ordernoFieldId);
        const orderno = customFields[index].value;
        setOrderNumber(orderno);
        getCustomerDetails(orderno);
        
        setKeyParam(orderno)
        console.log("keyparam if: ",keyParam)
        setLoading(false);
        // experimental 
        // const _res = await getCustomerDetailsFromUtilsFunc(orderno);
        // const _data = await _res.json();
        // console.log( "dfjklsd : ", _data );
      });
    } else {
      setOrderNumber(requester["ticket"].requester.email);  
      getUserDetail(requester["ticket"].requester.email);
      
      
      setKeyParam(requester["ticket"].requester.email)
      
      console.log("keyparam else: ",keyParam)
      setLoading(false);
    }
    
    requesterData(requester["ticket"].requester);
    setRequesterName(requesterName);

    // order no change event.
    if (client) {
      client.on('ticket.custom_field_'+defaultValues.ordernoFieldId+'.changed', function(_ordeno) {
        getCustomerDetails(_ordeno);
      });
      
    }
    /*      
      var settings = {
        url: endPoints.zendesk.previous_conversation+requester['ticket.requester'].id+'/tickets/requested?sort_by=created_at&sort_order=desc',
        headers: {"Authorization": "Basic aWFtd2ViZ3VydTVAZ21haWwuY29tOklhbXdlYmd1cnU1QDIwMjI="},
        secure: true,
        type: 'GET',
        contentType: 'application/json',
      };
      
      
      client.request(settings).then(function(ticketData) {
        //console.log("ticketData ----> ", ticketData.tickets);
        perviousConversation(ticketData.tickets);
      }).catch(function(error) {
        console.log("errors ===>", error.toString()); 
      });
      */
      // if (client) {
      //   client.on('ticket.requester.name.changed', function(e) {
      //     // console.log("e === > ", e);  
      //     setRequesterName(e)
      //   });
      // }
      
  };
  
  const onSubmitFunction = async (event) => {
    _loader = true;
    const _url = endPoints.account + event.searchQuery;
   
    const response = await fetch(_url);
    const data = await response.json();
    if (data.message == "Not Found") {
      setUserSearchResults([]);
    }
    else {
      setUserSearchResults([data]);
    }
    _loader = false;
    return false;
  };

  return (
    <div>
      <Script
        type="text/javascript"
        src="https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js"
        onLoad={() => {
          getRequester();
        }}
      />
      <div className="ez-card">
        <div className="ez-card-block pb-3">
          {/* { orderNumber ?  <LostPackageClaimComponent orderno={orderNumber} /> : ''} */}
        </div>
        <div className="ez-card-block pb-3">
          
          {isLoading ?  "" : <UserInfoComponent userparam={keyParam} />}
          {/* <UserDetailComponent
            user={userDetail}
            orderAggr={orderAggrigates}
            loaidingState={userApiLoadingState}
          /> */}
          {/* <a href="#">Customer notes</a> */}
        </div>
        <PreviousOrdersComponent
          orders={previousOrders}
          _loader_={orderAgrLoader}
        />
      </div>
    </div>
  );
}
