import {createContext, useState, useEffect, useContext} from 'react';
import {DataStore} from 'aws-amplify';
import {Basket, BasketDish, Dish} from '../models';
import {useAuthContext} from './AuthContext';
import { tealA100 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const BasketContext = createContext({});

const BasketContextProvider = ({children}) => {
  const {dbUser} = useAuthContext();
  const [restaurant, setRestaurant] = useState(null);
  const [basket, setBasket] = useState(null);
  const [basketDishes, setBasketDishes] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);


  useEffect(()=> {
    if(dishes && basketDishes && restaurant){
      const total =  basketDishes.reduce((sum, bd) => sum + bd.quantity*dishFinder(bd).price, restaurant.deliveryFee);
      setTotalPrice(total.toFixed(2));
    }
  },[dishes, basketDishes, restaurant]);

  useEffect(() => {
    DataStore.query(Dish).then(setDishes);
  }, []);

  useEffect(() => {
    //getExistingBasket for the user
    if (dbUser && restaurant) {
      DataStore.query(Basket, b =>
        b.and(b => [b.restaurantID.eq(restaurant.id), b.userID.eq(dbUser.id)]),
      ).then(baskets => setBasket(baskets[0]));
    }
  }, [dbUser, restaurant]);

  useEffect(() => {
    if (basket) {
      DataStore.query(BasketDish, bd => bd.basketID.eq(basket.id)).then(
        setBasketDishes,
      );
    }
  }, [basket]);

  const createNewBasket = async () => {
    const newBasket = await DataStore.save(
      new Basket({userID: dbUser.id, restaurantID: restaurant.id}),
    );
    setBasket(newBasket);
    return newBasket;
  };

  const addDishToBasket = async (dish, quantity) => {
    //get or create a existing BasketId if not there is any Basket for particular restaurant
    let theBasket;
    if (!basket) {
      theBasket = await createNewBasket();
    } else {
      theBasket = basket;
    }

    //create a BasketDish with dish,quantity , basketId and save to DataStore

    const newBasketDish = await DataStore.save(
      new BasketDish({quantity: quantity, Dish: dish, basketID: theBasket.id}),
    );
    console.log(dish, quantity);

    setBasketDishes([...basketDishes, newBasketDish]);
  };

  const dishFinder = (basketDish, type) => {
    let dishDetails;
    if(type == "ORDER"){
      dishDetails = dishes.filter(d => d.id === basketDish.orderDishDishId);
    }else if (type = "BASKET"){
      dishDetails = dishes.filter(d => d.id === basketDish.basketDishDishId);
    }

    console.log("6666",dishDetails)
    return dishDetails[0];
  };

  return (
    <BasketContext.Provider
      value={{
        addDishToBasket,
        setRestaurant,
        basket,
        basketDishes,
        restaurant,
        dishes,
        dishFinder,
        totalPrice
      }}>
      {children}
    </BasketContext.Provider>
  );
};

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext);
