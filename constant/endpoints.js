export const endPoints = {
    'account':'/api/account/',
    'order':'/api/order/',
    'peviousorders':'/api/order/previous-orders/',
    'peviousorders_from_order_no':'/api/order/previous-orders-orderno/',
    'orders_aggregates':'/api/order/orders-aggregates/',
    'orders_aggregates_from_orderno':'/api/order/orders-aggregates-orderno/',
    'lost_order_details':'/api/order/lost-order-details/',
    'get_tracking_info':'/api/order/tracking-info/',
    'login':'/api/login',
    'userdetails':'/api/user/',
    'customer_details':'/api/user/customer/',
    'new-tickets':'/api/new-ticket/',
    'zendesk': {
        'previous_conversation':'https://ezcontacts.zendesk.com/api/v2/users/',
        'baseurl_test':'https://richestsofthelp.zendesk.com/',
        'baseurl':'https://ezcontacts.zendesk.com/',
        'ticket':{
            'create':'api/v2/tickets.json',
        },
        'tickets':'/api/v2/tickets/',
        'ticket_forms':'/api/v2/ticket_forms/',
        'ticket_fields':'/api/v2/ticket_fields/',
    },
}