import React from 'react';
import {View, Text, StyleSheet, Image, FlatList} from 'react-native';

//json
import Orders from '../../../assets/data/orders.json';
const order = Orders[0];
import Restaurants from '../../../assets/data/restaurants.json';
import BasketDishItem from '../../components/BasketDish';
import { useOrderContext } from '../../contexts/OrderContext';



const OrderDetailsHeader = ({order}) => {
  const {orders,RestaurantFinder} = useOrderContext();
  



  return (
    <View>
      <View style={styles.menuHeader}>
        <Image source={{uri: RestaurantFinder(order).image}} style={styles.image} />

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{RestaurantFinder(order).name}</Text>
          <Text style={styles.subTitle}>{order.status} &#8226; 2days ago</Text>
        </View>
      </View>
      <Text style={styles.menuText}>Your Order</Text>
    </View>
  );
};

const OrderDetailsScreen = ({navigation, route}) => {
  const order = route.params.order;

  //get all orderDishes related to this order based on id
  const {OrderDishesOfOrder} = useOrderContext();
  console.log("5555",OrderDishesOfOrder(order))

  return (
    <View style={{flex: 1}}>
      <FlatList
        ListHeaderComponent={() => <OrderDetailsHeader order = {order} />}
        data={OrderDishesOfOrder(order)}
        renderItem={({item}) => <BasketDishItem basketDish={item} type = "ORDER" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 5 / 3,
  },
  title: {
    fontSize: 25,
    fontWeight: '500',
    marginVertical: 5,
    color: '#000',
  },
  subTitle: {
    color: 'grey',
    marginBottom: 13,
    fontSize: 15,
    fontWeight: '600',
  },
  detailsContainer: {
    margin: 10,
  },
  menuHeader: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
  menuText: {
    marginHorizontal: 10,
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
    marginTop: 10,
  },
});

export default OrderDetailsScreen;
