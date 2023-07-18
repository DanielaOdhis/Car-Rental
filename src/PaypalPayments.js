// import { PayPalButtons } from "@paypal/react-paypal-js";

// const PaypalPayment = ({cars}) => {
//     const createOrder = async (data) => {
//         console.log("confirmation hapa na pale")
//         // Order is created on the server and the order id is returned
//         const response = await fetch(`http://localhost:8888/my-server/create-paypal-order`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         // use the "body" param to optionally pass additional order information
//         // like product skus and quantities
//         body: JSON.stringify({
//           product: {
//             description: cars.Car_Type,
//             cost: cars.Charges_Per_Day
//           },
//         }),
//       });
//       const order = await response.json();
//       return order.id;
//       };
//       const onApprove = async (data) => {
//          // Order is captured on the server and the response is returned to the browser
//          const response = await fetch(`http://localhost:8888/my-server/capture-paypal-order`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             orderID: data.orderID
//           })
//         });
//         console.log("Payment Successful", response.json());
//         response.json();
//       };
//     return (
//         <PayPalButtons
//         createOrder={(data, actions) => createOrder(data, actions)}
//         onApprove={(data, actions) => onApprove(data, actions)}
//       />
//      );
// }

// export default PaypalPayment;