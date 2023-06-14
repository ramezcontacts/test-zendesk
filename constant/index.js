export const defaultValues = {
    'environment_type':'staging',
    'local':{
        'resultLimit':2,
        'baseurl':'http://192.168.1.161:8080',
        'zendesAuth': 'Basic cmFtLnJpY2hlc3Rzb2Z0QGdtYWlsLmNvbTpidXR0ZXJuYWFu',
        'apiAuth': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiaWFtd2ViZ3VydTUiLCJpYXQiOjE2NjAyMDM3NDksImV4cCI6MTY5MTczOTc0OX0.fKQIBRMSEji1GwERh6nBOdMj9rEoy1osIUY9nKsmNdk',
    },
    'staging':{
        'resultLimit':2,
        'baseurl':'https://p8rhfbgui1.execute-api.us-east-1.amazonaws.com/staging',
        'zendesAuth': 'Basic aWFtd2ViZ3VydTVAZ21haWwuY29tOklhbXdlYmd1cnU1QDIwMjI=',
        'apiAuth': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiaWFtd2ViZ3VydTUiLCJpYXQiOjE2NjAyMDM3NDksImV4cCI6MTY5MTczOTc0OX0.fKQIBRMSEji1GwERh6nBOdMj9rEoy1osIUY9nKsmNdk',
    },
    'production':{
        // 'baseurl':''
    },
    'view_in_admin_url':'https://www.ezcontacts.com/admin-manage/accounts/customers/edit/',
    'order_url':'https://www.ezcontacts.com/admin-manage/orders/view/',
    'agent_tickets_url':{base:'https://ezcontacts.zendesk.com/agent/tickets/', requested_ticket:'/requester/requested_tickets'},
    'requesterProfileUrl':'https://ezcontacts.zendesk.com/agent/users/_REQUESTER_ID_/requested_tickets',
    'defaultRequesterProfileUrl':'https://ezcontacts.zendesk.com/agent',
    'custInquiryformId':7113572723981,
    'lostPackageFormId':8450476644621,
    'ordernoFieldId':7250659106445,
    'trackingNoFieldId':7228464007821,
    'carrierFieldId':7140905421581,
    'shippedDateId':6917542556813,
    'defaultTicketForm':6266260594445,
    'carrierName':{
        'dhl': 'DHL',
        'usps': 'USPS',
        'fedex': 'FEDEX',
        'ups': 'UPS',
        'osm': 'OSM',
    }
}
