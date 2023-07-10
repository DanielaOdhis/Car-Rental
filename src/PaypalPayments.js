import { PayPalButtons } from "@paypal/react-paypal-js";

const PaypalPayment = ({cars}) => {
    const createOrder = (data) => {
        // Order is created on the server and the order id is returned
        return fetch(`http://localhost:8888/my-server/create-paypal-order`, {
          method: "POST",
           headers: {
            "Content-Type": "application/json",
          },
          // use the "body" param to optionally pass additional order information
          // like product skus and quantities
          body: JSON.stringify({
            product:{
               description:cars.Car_Type,
               cost: cars.Charges_Per_Day
              },
          }),
        })
        .then((response) => response.json())
        .then((order) => order.id);
      };
      const onApprove = (data) => {
         // Order is captured on the server and the response is returned to the browser
         return fetch(`http://localhost:8888/my-server/capture-paypal-order`, {
          method: "POST",
           headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderID: data.orderID
          })
        })
        .then((response) =>{
          console.log("Payment Successful", response.json());
          response.json()});
      };
    return (
        <PayPalButtons
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={(data, actions) => onApprove(data, actions)}
      />
     );
}

export default PaypalPayment;