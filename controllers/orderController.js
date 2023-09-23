const Order = require('../models/order');
const Product = require('../models/product');
const Payment = require('../models/payment');
const Shipping = require('../models/shipping');

exports.createOrder = async (req, res) => {
  try {
    // Extract order-related information from the request body
    const { userId, products, totalAmount } = req.body;

    // Create a new order
    const order = new Order({
      userId,
      products,
      totalAmount,
    });

    // Save the new order to the database
    await order.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.getAllOrders = async (req, res) => {
  try {
    // Retrieve all orders from the database
    const orders = await Order.find();

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrderById = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Retrieve the order by its ID from the database
      const order = await Order.findById(orderId);
  
      if (!order) {
        // Handle the case where the order is not found
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.updateOrderStatus = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { newStatus } = req.body; // You can pass the new status in the request body
  
      // Update the order status by its ID in the database
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: newStatus }, // Assuming your order model has a 'status' field
        { new: true } // Return the updated order
      );
  
      if (!updatedOrder) {
        // Handle the case where the order is not found
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  exports.addOrderItems = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { itemsToAdd } = req.body; // You can pass the items to add in the request body
  
      // Find the order by its ID in the database
      const order = await Order.findById(orderId);
  
      if (!order) {
        // Handle the case where the order is not found
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Add the items to the order's items array
      order.items.push(...itemsToAdd);
  
      // Save the updated order with the new items
      const updatedOrder = await order.save();
  
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.updateOrderItem = async (req, res) => {
    try {
      const { orderId, itemId } = req.params;
      const { updatedItemData } = req.body; // You can pass the updated item data in the request body
  
      // Find the order by its ID in the database
      const order = await Order.findById(orderId);
  
      if (!order) {
        // Handle the case where the order is not found
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Find the item within the order's items array by its ID
      const itemToUpdate = order.items.find((item) => item._id == itemId);
  
      if (!itemToUpdate) {
        // Handle the case where the item is not found within the order
        return res.status(404).json({ error: 'Item not found within the order' });
      }
  
      // Update the item with the provided data
      Object.assign(itemToUpdate, updatedItemData);
  
      // Save the updated order with the updated item
      const updatedOrder = await order.save();
  
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.removeOrderItem = async (req, res) => {
    try {
      const { orderId, itemId } = req.params;
  
      // Find the order by its ID in the database
      const order = await Order.findById(orderId);
  
      if (!order) {
        // Handle the case where the order is not found
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Remove the item from the order's items array by its ID
      order.items = order.items.filter((item) => item._id != itemId);
  
      // Save the updated order without the removed item
      const updatedOrder = await order.save();
  
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.checkoutOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Find the order by its ID in the database
      const order = await Order.findById(orderId);
  
      if (!order) {
        // Handle the case where the order is not found
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Calculate the total price of the order based on the items
      let totalPrice = 0;
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
  
        if (!product) {
          // Handle the case where a product is not found
          return res.status(404).json({ error: 'Product not found' });
        }
  
        // Update the product's inventory or perform other necessary actions
  
        totalPrice += product.price * item.quantity;
      }
  
      // Update the order status to "Completed" and save the total price
      order.status = 'Completed';
      order.totalPrice = totalPrice;
  
      // Save the updated order
      await order.save();
  
      res.status(200).json({ message: 'Order checked out successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getOrderHistory = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find all orders for the user with the specified user ID
      const orderHistory = await Order.find({ userId });
  
      // Return the order history as a JSON response
      res.status(200).json(orderHistory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  exports.cancelOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Find the order by its ID
      const orderToCancel = await Order.findById(orderId);
  
      if (!orderToCancel) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Check if the order can be canceled (e.g., order status is 'pending')
      if (orderToCancel.status !== 'pending') {
        return res.status(400).json({ message: 'Order cannot be canceled' });
      }
  
      // Implement your logic to cancel the order here
      // You can update the order status or perform other necessary actions
  
      // Save the updated order
      await orderToCancel.save();
  
      // Return a success message
      res.status(200).json({ message: 'Order canceled successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.refundOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Find the order by its ID
      const orderToRefund = await Order.findById(orderId);
  
      if (!orderToRefund) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Check if the order can be refunded (e.g., order status is 'completed')
      if (orderToRefund.status !== 'completed') {
        return res.status(400).json({ message: 'Order cannot be refunded' });
      }
  
      // Implement your logic to process the refund here
      // You may need to interact with a Payment model or a payment gateway
  
      // Update the order status to 'refunded' or perform other necessary actions
  
      // Save the updated order
      await orderToRefund.save();
  
      // Return a success message
      res.status(200).json({ message: 'Order refunded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getOrderShippingDetails = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Find the order by its ID
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Check if the order has associated shipping information
      if (!order.shipping) {
        return res.status(404).json({ message: 'Shipping information not found for this order' });
      }
  
      // Retrieve the shipping details for the order
      const shippingDetails = await Shipping.findById(order.shipping);
  
      if (!shippingDetails) {
        return res.status(404).json({ message: 'Shipping details not found' });
      }
  
      // Return the shipping details
      res.status(200).json(shippingDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.manageOrderShipping = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { action } = req.body;
  
      // Find the order by its ID
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Check if the order has associated shipping information
      if (!order.shipping) {
        return res.status(404).json({ message: 'Shipping information not found for this order' });
      }
  
      // Handle different shipping-related actions based on the 'action' parameter
      if (action === 'markShipped') {
        // Mark the order as shipped (update the order status or shipping status)
        order.status = 'Shipped'; // Update the status as needed
        await order.save();
  
        // You can also update other shipping-related data or perform actions here
  
        res.status(200).json({ message: 'Order marked as shipped' });
      } else if (action === 'cancelShipment') {
        // Cancel the shipment or update shipping status
        // Implement the cancellation logic as needed
  
        res.status(200).json({ message: 'Shipment canceled' });
      } else {
        res.status(400).json({ message: 'Invalid action' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.fulfillOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Find the order by its ID
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Check if the order has already been fulfilled
      if (order.isFulfilled) {
        return res.status(400).json({ message: 'Order is already fulfilled' });
      }
  
      // Perform actions to fulfill the order
      // For example, you might update the order status, deduct product quantities, and update inventory
  
      // Update the order status to "Fulfilled"
      order.isFulfilled = true;
      await order.save();
  
      // Deduct product quantities or perform any other necessary actions
      // You may need to loop through order items and update product quantities accordingly
  
      // For example, if you have an order items array in your order model:
      // order.items.forEach(async (item) => {
      //   const product = await Product.findById(item.productId);
      //   if (product) {
      //     product.quantity -= item.quantity;
      //     await product.save();
      //   }
      // });
  
      res.status(200).json({ message: 'Order fulfilled successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.processOrderReturns = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Find the order by its ID
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Check if the order has already been returned
      if (order.isReturned) {
        return res.status(400).json({ message: 'Order is already returned' });
      }
  
      // Perform actions to process the order return
      // For example, you might update the order status, restock returned products, and handle refunds
  
      // Update the order status to "Returned"
      order.isReturned = true;
      await order.save();
  
      // Handle restocking of products and refunds
      // You may need to loop through order items and update product quantities, handle refunds, etc.
  
      // For example, if you have an order items array in your order model:
      // order.items.forEach(async (item) => {
      //   const product = await Product.findById(item.productId);
      //   if (product) {
      //     product.quantity += item.quantity; // Restock returned items
      //     // Handle refunds to the user's payment method if necessary
      //     await product.save();
      //   }
      // });
  
      res.status(200).json({ message: 'Order return processed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };