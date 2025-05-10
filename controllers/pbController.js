const axios = require('axios')

class pbController {
    async handlePostback(req, res) {
        try {
            const {
                apps_flyer_id,
                status,
                payout_currency,
                payout_amount,
                appsflyer_dev_key,
                app_id_string
            } = req.query;

            if (!apps_flyer_id || !status || !payout_currency || !payout_amount || !appsflyer_dev_key || !app_id_string) {
                return res.status(400).json({ message: 'Missing required query parameters' });
            }

            let eventName, eventValue;
            if (status === 'lead') {
                eventName = 'af_registration';
                eventValue = JSON.stringify({ af_revenue: 0 });
            } else if (status === 'sale') {
                eventName = 'af_purchase';
                eventValue = JSON.stringify({ af_revenue: parseFloat(payout_amount) });
            } else {
                return res.status(400).json({ message: 'Unknown status' });
            }

            const postData = {
                appsflyer_id: apps_flyer_id,
                eventCurrency: payout_currency,
                eventName,
                eventValue
            };

            const url = `https://api2.appsflyer.com/inappevent/${app_id_string}`;

            const response = await axios.post(url, postData, {
                headers: {
                    'Content-Type': 'application/json',
                    'authentication': appsflyer_dev_key
                }
            });

            console.log('Postback sent successfully:', response.data);

            res.status(200).json({ message: 'Postback forwarded successfully', data: response.data });

        } catch (error) {
            console.error('Error forwarding postback:', error.message);
            res.status(500).json({ message: 'Error forwarding postback', error: error.message });
        }
    }
}

module.exports = new pbController




// универсальная функция отправки пб как для фб так и для аф по квери параметру source. Для его передачи сюда, его нужно будет цеплять из трекинга

// const axios = require('axios');
// const qs = require('qs'); // Для удобной сборки query строки для Facebook

// class pbController {
//     async handlePostback(req, res) {
//         try {
//             const {
//                 source,
//                 apps_flyer_id,
//                 status,
//                 payout_currency,
//                 payout_amount,
//                 appsflyer_dev_key,
//                 app_id_string,
//                 gaid,
//                 app_facebook_id,
//                 facebook_client_token
//             } = req.query;

//             if (!source) {
//                 return res.status(400).json({ message: 'Missing source parameter (af or fb)' });
//             }

//             if (!status || !payout_currency || payout_amount === undefined) {
//                 return res.status(400).json({ message: 'Missing essential postback parameters' });
//             }

//             if (source === 'af') {
//                 // Проверяем обязательные параметры для AppsFlyer
//                 if (!apps_flyer_id || !appsflyer_dev_key || !app_id_string) {
//                     return res.status(400).json({ message: 'Missing AppsFlyer parameters' });
//                 }

//                 let eventName, eventValue;
//                 if (status === 'lead') {
//                     eventName = 'af_registration';
//                     eventValue = JSON.stringify({ af_revenue: 0 });
//                 } else if (status === 'sale') {
//                     eventName = 'af_purchase';
//                     eventValue = JSON.stringify({ af_revenue: parseFloat(payout_amount) });
//                 } else {
//                     return res.status(400).json({ message: 'Unknown status' });
//                 }

//                 const postData = {
//                     appsflyer_id: apps_flyer_id,
//                     eventCurrency: payout_currency,
//                     eventName,
//                     eventValue
//                 };

//                 const url = `https://api2.appsflyer.com/inappevent/${app_id_string}`;

//                 const response = await axios.post(url, postData, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'authentication': appsflyer_dev_key
//                     },
//                     timeout: 5000 // 5 секунд таймаут
//                 });

//                 console.log('Postback sent to AppsFlyer:', response.data);
//                 return res.status(200).json({ message: 'Postback forwarded to AppsFlyer', data: response.data });

//             } else if (source === 'fb') {
//                 // Проверяем обязательные параметры для Facebook
//                 if (!gaid || !app_facebook_id || !facebook_client_token) {
//                     return res.status(400).json({ message: 'Missing Facebook parameters' });
//                 }

//                 let eventName;
//                 if (status === 'lead') {
//                     eventName = 'fb_mobile_complete_registration';
//                 } else if (status === 'sale') {
//                     eventName = 'fb_mobile_purchase';
//                 } else {
//                     return res.status(400).json({ message: 'Unknown status' });
//                 }

//                 const query = {
//                     event: 'CUSTOM_APP_EVENTS',
//                     advertiser_tracking_enabled: 1,
//                     application_tracking_enabled: 1,
//                     custom_events: JSON.stringify([
//                         {
//                             _eventName: eventName,
//                             _valueToSum: parseFloat(payout_amount),
//                             fb_currency: 'USD'
//                         }
//                     ]),
//                     advertiser_id: gaid,
//                     access_token: `${app_facebook_id}|${facebook_client_token}`
//                 };

//                 const url = `https://graph.facebook.com/${app_facebook_id}/activities?${qs.stringify(query)}`;

//                 const response = await axios.get(url, { timeout: 5000 });

//                 console.log('Postback sent to Facebook:', response.data);
//                 return res.status(200).json({ message: 'Postback forwarded to Facebook', data: response.data });

//             } else {
//                 return res.status(400).json({ message: 'Invalid source parameter (only af or fb allowed)' });
//             }

//         } catch (error) {
//             console.error('Error forwarding postback:', error.message);
//             return res.status(500).json({ message: 'Error forwarding postback', error: error.message });
//         }
//     }
// }

// module.exports = new pbController();



// примеры запросов

// для аф

// http://localhost:3000/api/newPb?source=af&apps_flyer_id=xxx&status=lead&payout_currency=usd&payout_amount=0&appsflyer_dev_key=xxx&app_id_string=yyy

// для фб

// http://localhost:3000/api/newPb?source=fb&gaid=xxx&status=sale&payout_currency=usd&payout_amount=100&app_facebook_id=xxx&facebook_client_token=yyy
