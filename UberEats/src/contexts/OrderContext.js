import {createContext, useContext, useState, useEffect} from 'react';
import {DataStore} from 'aws-amplify';
import {
  Dish,
  Order,
  OrderDish,
  Basket,
  BasketDish,
  Restaurant,
} from '../models';
import {useAuthContext} from './AuthContext';
import {useBasketContext} from './BasketContext';

const OrderContext = createContext();

const OrderContextProvider = ({children}) => {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orderDishes, setOrderDishes] = useState([]);
  const {dbUser} = useAuthContext();
  const {restaurant, totalPrice, basketDishes, dishFinder, basket} =
    useBasketContext();

    const RestaurantFinder = (order) => {
        const restaurantDetails = restaurants.filter((res) => res.id == order.orderRestaurantId);
        return restaurantDetails[0];
    }


    useEffect(() => {

          DataStore.query(OrderDish ).then(setOrderDishes);
        
      }, [orders]);

  useEffect(() => {
    DataStore.query(Restaurant).then(setRestaurants);
  }, []);

  useEffect(() => {
    if (dbUser) {
      DataStore.query(Order, o => o.userID.eq(dbUser.id)).then(setOrders);
    }
  }, [dbUser]);


  const OrderDishesOfOrder = (order) => {
    const OrderDishesDetails = orderDishes.filter((oo) => oo.orderID == order.id);
    console.log("7777",OrderDishesDetails, order);
    return OrderDishesDetails;
  }


  const CreateOrder = async () => {
    //create a new Order
    const newOrder = await DataStore.save(
      new Order({
        userID: dbUser.id,
        Restaurant: restaurant,
        status: 'NEW',
        total: parseFloat(totalPrice),
      }),
    );

    //add all BasketDishes to Order i.e., creating orderDishes for each BasketDishes.
    //so that we can delete all the BasketDishes.
    await Promise.all(
      basketDishes.map(basketDish =>
        DataStore.save(
          new OrderDish({
            quantity: basketDish.quantity,
            orderID: newOrder.id,
            Dish: dishFinder(basketDish),
          }),
        ),
      ),
    );

    //delete Basket, BasketDishes
    console.log('8899', basket);
    //NOTE: dishes are deleting but not the basket or basketDishes.
    //need to find a way!!! :(
    //await DataStore.delete(basket);

    //addd this new order to already present orders
    setOrders([...orders, newOrder]);
  };

  return (
    <OrderContext.Provider value={{CreateOrder, orders,restaurants,RestaurantFinder,orderDishes,OrderDishesOfOrder}}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;
export const useOrderContext = () => useContext(OrderContext);
