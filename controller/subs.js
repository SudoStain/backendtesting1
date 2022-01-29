import User from '../models/user'
import { buffer } from 'micro'


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export const prices = async (req, res) => {
    const prices = await stripe.prices.list()
    // console.log('prices', prices)
    res.json(prices.data.reverse())
}

// export const createSubscription = async (req, res) => {
//     try {

//    data = res.body
//         const user = await User.findById(req.user._id)
//     const session = await stripe.checkout.sessions.create({
//         mode: 'subscription',
//         payment_method_types: ['card'],
//         data,
//         customer: user.stripe_customer_id,
//         success_url: process.env.STRIPE_SUCCESS_URL,
//         cancel_url: process.env.STRIPE_CANCEL_URL,
//     })
//     console.log('checkout session', session)
//     res.json(session.url)
        
//     } catch (error) {
//         console.log(error)
        
//     }
// }

export const createSubscription = async (req, res) => {

  if (req.method === 'POST') {
    const buf = await buffer(req);
    // const sig = req.headers['stripe-signature'];
    const webhookSecret =
      process.env.STRIPE_SECRET_KEY
      process.env.STRIPE_WEBHOOK_SECRET;
    let event
  try {
    event = stripe.webhooks.constructEvent(buf.toString(), webhookSecret)
    
  } catch (err) {
    console.log(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
    
  }

 
 
  
  if (relevantEvents.has(event.type)) { 
    try {
      
      const user = await User.findById(req.user._id)
  
    switch (event.type) {
      case 'customer.subscription.created':
      // ... handle other event types
      
      break;
      case 'checkout.session.completed':
        const checkoutSession = event.data.object;
        if (checkoutSession.mode === 'subscription') {
          
          const subscriptionId = checkoutSession.subscription;
          (
            subscriptionId,
            checkoutSession.customer,
            user,
            
            true
          );
        }
      default:
        throw new Error('Unhandled relevant event!');
    }
  

  
      
  } catch (error) {
    console.log(error);
    return res.json({ error: 'Webhook handler failed. View logs.' });
    
      
  }
}
res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

// export const createSubscription = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id)
//     let data;
//     let eventType;
//     // Check if webhook signing is configured.
//     const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
//     if (webhookSecret) {
//       // Retrieve the event by verifying the signature using the raw body and secret.
//       let event;
//       let signature = req.headers["stripe-signature"];
  
//       try {
//         event = stripe.webhooks.constructEvent(
//           req.body,
//           signature,
//           customer,
//           webhookSecret
//         );
//       } catch (err) {
//         console.log(`⚠️  Webhook signature verification failed.`);
//         return res.sendStatus(400);
//       }
//       // Extract the object from the event.
//       data = event.data;
//       eventType = event.type;
//     } else {
//       // Webhook signing is recommended, but if the secret is not configured in `config.js`,
//       // retrieve the event data directly from the request body.
//       data = req.body.data;
//       eventType = req.body.type;
//     }
  
//     switch (eventType) {
//       case 'subscription_schedule.created':
//         const subscriptionSchedule = eventType.data.object;
//         // Then define and call a function to handle the event subscription_schedule.created
//         break;
//       // ... handle other event types
//       default:
//         console.log(`Unhandled event type ${eventType.type}`);
//     }
  
//     res.sendStatus(200);
//   } finally {

   

    

//   }}


export const subscriptionStatus = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripe_customer_id,
        status: "all",
        expand: ["data.default_payment_method"],
      });
  
      const updated = await User.findByIdAndUpdate(
        user._id,
        {
          subscriptions: subscriptions.data,
        },
        { new: true }
      );
  
      res.json(updated);
    } catch (err) {
      console.log(err);
    }
  };

  export const subscriptions = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripe_customer_id,
        status: "all",
        expand: ["data.default_payment_method"],
      });
  
      res.json(subscriptions);
    } catch (err) {
      console.log(err);
    }
  };
  
  export const customerPortal = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripe_customer_id,
        return_url: process.env.STRIPE_SUCCESS_URL,
      });
      res.json(portalSession.url);
    } catch (err) {
      console.log(err);
    }
  };

//   export const createSubscription = async (req, res) => {
//     try {
//       line_items = subscriptions
//         const user = await User.findById(req.user._id)
//     const session = await stripe.checkout.sessions.create({
//         mode: 'subscription',
//         payment_method_types: ['card'],
//         line_items,
      
//         customer: user.stripe_customer_id,
//         success_url: process.env.STRIPE_SUCCESS_URL,
//         cancel_url: process.env.STRIPE_CANCEL_URL,
//     })
//     console.log('checkout session', session)
//     res.json(session.url)
        
//     } catch (error) {
//         console.log(error)
        
//     }
// }




  
