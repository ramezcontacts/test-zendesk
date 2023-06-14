/* eslint-disable @next/next/no-img-element */
import { useForm, } from 'react-hook-form';
import { useState } from 'react';
import Script from 'next/script'
import { getSession } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faLocationDot, faLocationCrosshairs, faCalendarDays, faCircle } from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { usersEndPoint }  from '../constant/endpoints/users';
import { accountEndPoint }  from '../constant/endpoints/account';
import { endPoints } from '../constant/endpoints';
import { defaultValues }  from '../constant';
import useStorage from '../hooks/useStorage.ts';




const { searchResults = [] } = [];
const { getItem } = useStorage();
const { setItem } = useStorage();
let baseurl, envType, _searchQuery, _loader = false, _loadOrder = false;
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

export default function Home({_app_data}) {
    
  

    envType = defaultValues.environment_type;
    // baseurl = getUrl(envType);
    // console.log("baseurl: ", baseurl);
    
    // let orderEndPoint = endPoints.order;
    // console.log("orderEndPoint: ", orderEndPoint);
    
    const [userSearchResults, setUserSearchResults] = useState([]);    
    const [zafobj, setZafobj] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [requesterName, setRequesterName] = useState(null);
    const [reqData, setReqData] = useState({});
    const [recentOder, setRecentOder] = useState({
      id:null,
      price:null,
      date:null,
      status:null,
      timeSinceOrder:null
    });
    
    const [previousOrders, setPreviousOrders] = useState([]);
    const [previousTickets, setPreviousTickets] = useState([]);
    const validationSchema = Yup.object().shape({
        searchQuery: Yup.string()
            .required('This field is required'),
    });
   

    const formOptions = { resolver: yupResolver(validationSchema) };
    // console.log(userSearchResults.length)
    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;
    function resetFunction () {
      setUserSearchResults([]);
      reset();
    }

    function requesterData(data){
      console.log("=======> ",data);
      console.log("data =======> ",data);
      setUserEmail(data.email)
      setUserName(data.name)
      setReqData(data)
      console.log("===> ".data);
      console.log("requester =======> ", userName);
      getOrder(data.email);
    }

    function perviousConversation(ticketData){
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
          return '';
      }
    }

    const getOrder = async (email) => {
      
      _loadOrder = true;
      console.log("inside getOrder", email)
      try {
        const res = await fetch(endPoints.order+email);
        const data = await res.json();

        console.log("this case: ", data)
        if (data._404Status){
          console.log("this case ==>: ", data);
          _loadOrder = false;
          console.log("_loadOrder: ==>: ", _loadOrder);
         // return false;
        }
        else if ( !data.errorStatus) {
          const _date = new Date(data.created)
          const formattedDate = _date.toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                  })
                                  recentOder.id = data.id;
          const today = new Date();
          const _days = dateDiff(data.created, today ).d
          setRecentOder({
            id:data.id,
            price: "$ "+data.total,
            date:formattedDate,
            status:data.status.description,
            timeSinceOrder: _days+ " days"
          })

          var today = new Date();
          var previousDate = formattedDate;
          var diffMs = (today - previousDate); 
          var diffDays = Math.floor(diffMs / 86400000); // 

          // console.log("todayFormattedDate ======> : ",dateDiff(data.created, today ).d );
          // console.log("ordre price ======> : ", data.total);
          // console.log("ordre date ======> : ", data.created);
          // console.log("ordre time since order ======> : ", data.created);
          // console.log("ordre status ======> : ", data.status.description);
          // console.log("recentOder: ",recentOder)
          _loadOrder = false;
        } else  {
          _loadOrder = false;
          //console.log("Getting error while fetching data.", data);
        }
        const resPrevousOrder = await fetch(endPoints.peviousorders+email);
        const dataPrevousOrder = await resPrevousOrder.json();
        previousOrderData(dataPrevousOrder);

        console.log("previousOrders: ", previousOrders);
      } catch (err) {
        _loadOrder = false
       // console.log("try catch error logs: ",err);
      }
      return false;
      
    };

    function formatOrderDate(createdDate){
      const _date = new Date(createdDate)
      return _date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    }
    
    function timeSinceOrder(createdDate){
      return dateDiff(createdDate, new Date() ).d;
    }

    function dateDiff( str1, str2 ) {
      var diff = Date.parse( str2 ) - Date.parse( str1 ); 
      return isNaN( diff ) ? NaN : {
          diff : diff,
          ms : Math.floor( diff            % 1000 ),
          s  : Math.floor( diff /     1000 %   60 ),
          m  : Math.floor( diff /    60000 %   60 ),
          h  : Math.floor( diff /  3600000 %   24 ),
          d  : Math.floor( diff / 86400000        )
      };
  }

  function previousOrderData( recentOderData ){
    console.log(typeof recentOderData);
    console.log("orecentOderData :", recentOderData);
    setPreviousOrders(recentOderData)
    if (data._404Status){
      setPreviousOrders([]);
    }
    else if ( !data.errorStatus) {
      setPreviousOrders(recentOderData);
    } else {
      setPreviousOrders([]);
    }
  }


    const getRequester = async () => {

      /* getting authtoken */
      let authToken = getItem('token');
      console.log("1. token: ", authToken)
      console.log(typeof "token ===> : ", authToken); 
      if ( authToken === "undefined" || authToken === undefined ) {
        const token = await fetch(endPoints.login);
        const data = await token.json();
        console.log(typeof "===> after login: ", data.access_token)
        if( data.access_token == 'false' || data.access_token == false){
          console.log("unquthorized");
        } else {
          console.log("authrized");
          const setToken = setItem('token', data.access_token);
          authToken = data.access_token
        }
      } else {
        console.log("token: "+false)
      }
      /* end of getting authToken */

      console.log("2. token: ", authToken)

     
      // console.log("setToken token ===> : ", setToken); 
      var client = ZAFClient.init();
      const requester = await client.get("ticket.requester");
      const requesterName = requester['ticket.requester'].name;
      console.log(requesterName);

      requesterData(requester['ticket.requester']);
      setRequesterName(requesterName)
      
      client.invoke('resize', {width: '100%', height: '300px'});

      var settings = {
        url: endPoints.zendesk.previous_conversation+requester['ticket.requester'].id+'/tickets/requested?sort_by=created_at&sort_order=desc',
        headers: {"Authorization": "Basic aWFtd2ViZ3VydTVAZ21haWwuY29tOklhbXdlYmd1cnU1QDIwMjI="},
        secure: true,
        type: 'GET',
        contentType: 'application/json',
      };

      client.request(settings).then(function(ticketData) {
        console.log("ticketData ----> ", ticketData.tickets);
        perviousConversation(ticketData.tickets);
      }).catch(function(error) {
          console.log("errors ===>", error.toString()); 
        });

        if (client) {
          client.on('ticket.requester.name.changed', function(e) {
              setRequesterName(e)
          });
        }
    };

    const onSubmitFunction = async (event) => {
      // console.log('dfsa');
      // return false;
      _loader = true;
      const _url = endPoints.account+event.searchQuery
      console.log(_url);
      // return false;
      const response = await fetch(_url)
      const data = await response.json()

      console.log(typeof "data: ", data);
      console.log(data.name);
      if (data.message == 'Not Found'){
          setUserSearchResults([]);
      } 
      // else if( typeof(data.message) !== 'Unauthorized' ){
      //   setUserSearchResults([data]);
      // } 
      else{
        setUserSearchResults([data]);
      } 
      _loader = false;
      return false;
    };
    
    
    /*
    const onSubmitFunction = async (event) => {
      _loader = true;
      _searchQuery = event.searchQuery;
      const _apiUrl = usersEndPoint.edgeSearchUser+_searchQuery
      const response = await fetch(_apiUrl);
      const data = await response.json();
      
      console.log(data.users.length); //return false;

      if( data.users.length > 0 ){
        setUserSearchResults(data.users);
      } else {
        setUserSearchResults([]);
      }
      _loader = false;
       return false;
      if( typeof(data.info) !== 'undefined' ){
        searchResults = data.results;
        return false;
        setUserSearchResults(data.results);
      } else {
        // else case here
        setUserSearchResults([]);
      }
      _loader = false;
    };
    
    */

    return (
      <div>
        <Script
           type="text/javascript"
           src="https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js"
            onLoad={() => { getRequester(); }}
          
        />
        <div className="card customer-details">
            {/* <div className="card-body">
              <div className="customer-blk">
                <form onSubmit={handleSubmit(onSubmitFunction)}>
                      <div className="form-row row">
                          <div className="col-6 d-flex align-items-center">
                              <input name="searchQuery" type="text" {...register('searchQuery')} className={`form-control ${errors.searchQuery ? 'is-invalid' : ''}`} />
                          </div>
                          <div className="col-6">
                            <button type="submit" className="btn btn-primary mr-1">Search</button>
                            <button type="button" onClick={ resetFunction} className="btn btn-secondary">Clear</button>
                        </div>
                        { _loader ? <Loader /> : ''} 
                      </div>
                  </form>
              </div>
            </div> */}
            <div className='card-body'>
              { reqData ? 
                <div key={reqData.id} className="customer-blk">
                  {/* <div className="customer-heading">
                      <h4>Customer Information</h4>
                  </div> */}
                  <div className="pad10px">
                    <div className="customer-box">
                        <h4 id="requester_name">
                          {requesterName}
                        </h4>
                    </div>
                    <div className="customer-box">
                        <p><FontAwesomeIcon icon={faEnvelope} className="fa-solid fa-envelope"></FontAwesomeIcon>&nbsp; Email Id: </p>
                        <span id="requester_email">{reqData.email}</span>
                    </div>
                    <div className="customer-box">
                        <p><FontAwesomeIcon icon={faUser} className="fa-solid fa-user"></FontAwesomeIcon>&nbsp;
                        Customer Id: </p>
                        <span id="requester_id">{reqData.id}</span>
                    </div>
                  </div>
                </div>
              : '' }
            </div>
             <div className='card-body'>
              { reqData ? 
                <div key={reqData.id} className="customer-blk">
                  <div className="customer-heading">
                      <h5>Previous conversations</h5>
                  </div>
                  <div className="pad10px">
                  <div className='timiline'>
                  {previousTickets.map(ticketData=>{
                    return (
                    <div key={ticketData.id} className='timeline-event'>
                      <div className='timeline-content-box'>
                      <div className='timeline-card-content d-flex'>
                        <div className='timeline-circle'>
                          <FontAwesomeIcon icon={faEnvelope} className="fa-solid fa-envelope"></FontAwesomeIcon></div>
                      <div className='timeline-txt'>
                       <p>
                          {/* { ticketData.status == 'open' ? <span><FontAwesomeIcon icon={faCircle} className="fa-solid fa-circle red"></FontAwesomeIcon>&nbsp; </span>: <span><FontAwesomeIcon icon={faCircle} className="fa-solid fa-circle gray"></FontAwesomeIcon>&nbsp; </span>} */}
                          
                          {ticketData.subject}
                          </p>
                          </div>
                          </div>
                      </div>
                      </div>

                    )
                  })}

                  </div>
                  </div>
                </div>
              : '' }
            </div>
            {/* { _loader ? '':
              <div className='card-body dss'>
                { userSearchResults.map( result => {
                    const {id, name, image} = result;
                    return (
                    <div key={id} className="customer-blk">
                      <div className="customer-heading">
                          <h4>Customer Information</h4>
                      </div>
                      <div className="pad10px">
                        <div className="customer-box">
                            <h4 id="requester_name">
                            {result.name}
                            </h4>
                        </div>
                        <div className="customer-box">
                            <p><FontAwesomeIcon icon={faEnvelope} className="fa-solid fa-envelope"></FontAwesomeIcon>&nbsp; Email Id: </p>
                            <span id="requester_email">{result.email}</span>
                        </div>
                        <div className="customer-box">
                            <p><FontAwesomeIcon icon={faUser} className="fa-solid fa-user"></FontAwesomeIcon>&nbsp;
                            Customer Id: </p>
                            <span id="requester_id">{result.id}</span>
                        </div>
                      </div>
                      
                      <div className="border pad10px">
                          <div className="order-id">
                              <h5 className="mb-3">Shipping Information</h5>
                              <div className="order-id-box">
                                  <p><FontAwesomeIcon icon={faLocationDot} className="fa-solid fa-location-dot"></FontAwesomeIcon>&nbsp;
                                    Shipping Address: </p>
                                  <span>
                                  # {result.location.street.number},&nbsp;
                                  {result.location.street.name}&nbsp;
                                  {result.location.city} &nbsp;
                                  {result.location.state} &nbsp;
                                  {result.location.country} - {result.location.postcode}
                                  </span>
                              </div>
                              <div className="order-id-box">
                                  <p><FontAwesomeIcon icon={faLocationCrosshairs} className="fa-solid fa-location-crosshairs"></FontAwesomeIcon>&nbsp;
                                    <i className="fa-solid fa-location-crosshairs"></i> Tracking Number: </p>
                                  <span>{result.login.md5}</span>
                              </div>
                          </div>
                      </div>

                      <div className="border pad10px">
                          <div className="order-id">
                              <h5 className="mb-3">Order Details</h5>
                              <div className="order-id-box">
                                  <p><FontAwesomeIcon icon={faCalendarDays} className="fa-solid fa-calendar-days"></FontAwesomeIcon>&nbsp;
                                   Created: 7/7/2021</p>
                                  <span>$370.00 USD</span>
                              </div>
                          </div>
                      </div>
                
                      <div className="border pad10px">
                          <div className="order-id">
                              <h5 className="mb-3">Status</h5>
                              <div className="order-id-box">
                                  <p><FontAwesomeIcon icon={faCircle} className="fa-solid fa-circle"></FontAwesomeIcon>&nbsp;
                                    Fulfilled: </p>
                                  <span><FontAwesomeIcon icon={faCircle} className="fa-solid fa-circle green"></FontAwesomeIcon>&nbsp;
                                   Paid</span>
                              </div>
                          </div>
                      </div> 

                      <div>
                          <div className="order-id-box">
                              <p>Jordan 1: </p>
                              <span>$160.00 * 1 $160.00</span>
                          </div>
                          <div className="order-id-box">
                              <p>Veilance FRAME SS: </p>
                              <span>$160.00 * 1 $160.00</span>
                          </div>
                          <div className="order-id">
                              <span>SHIRT MEN&apos;S - L</span>
                          </div>
                      </div>
                    </div>
                  )
                } ) }

            { userSearchResults.length ? '': <center></center>}
              </div>

            } */}


            <div className='card-body'>
              <div className="customer-blk mb-4">
                <div className="customer-header mb-4">
                    <h4 className='mb-2'>EZContacts Data</h4>
                    <p>Customer Since 19 Oct, 2021</p>
                </div>
              
                <div className="customer-box">
                  <h6>Most Recent Order</h6>
                </div>
                {/* { _loadOrder ? <span><center>Loading...</center></span> : '' } */}
                { recentOder ? <>
                  <div className="customer-box">
                      <p>{recentOder.id}</p>
                      <span>{recentOder.price}</span>
                  </div>
                  <div className="customer-box">
                    <p>{recentOder.date}</p>
                    <span>{recentOder.timeSinceOrder}</span>
                  </div>
                  <div className="customer-user-blk">
                    <p className='fw-bold'>{recentOder.status}</p>
                  </div></> : <small>no data received</small> }
                
              </div>
             </div>
             <div className='card-body'>
              <div className="customer-blk">
              <div className="customer-box"><h6>Order Aggregates</h6></div>
                <div className="customer-box">
                  <p>All Time Purchases :</p>
                  <span>$198.12</span>
              </div>
              <div className="customer-box">
                  <p>Average Purchase :</p>
                  <span>$33.02</span>
              </div>
                <div className="customer-box">
                  <p>Past 12 Months :</p>
                  <span>$198.12</span>
                </div>
                <div className="customer-box border pb-4">
                  <p>Last 12 Months Avg :</p>
                  <span>$198.12</span>
                </div>
              </div>
              <div className="customer-user-blk">
                <h6 className='fw-bold my-4'>Previous orders</h6>
              </div>

                { previousOrders.length ?  previousOrders.map(orderData=>{
                    return (
                      <div key={orderData.id} className="margin-botton border">
                        <div className="customer-box">
                          <p>{orderData.id}</p>
                            <span>$ {orderData.total}</span>
                        </div>
                        <div className="customer-box">
                          <p> {formatOrderDate( orderData.created )}</p>
                          <span> {timeSinceOrder(orderData.created)} days</span>
                        </div>
                        <div className="customer-user-blk">
                          <p className='fw-bold'>{orderData.status.description}</p>
                        </div>
                      </div>
                     
                    )
                }) : <small>no data received</small>}

            </div>
        </div>
      </div>
    );
}
