import React from 'react';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import { useOrderContext } from '../../contexts/OrderContext';




const OrderListItem = ({order,navigation,}) => {

  const {orders,RestaurantFinder} = useOrderContext();

  return (
    <Pressable style = {styles.OrderListRow} onPress = {() => navigation.navigate("OrderDetails", {order : order})}>
      <Image
        source={{uri: RestaurantFinder(order).image}}
        style={{width: 80, height: 80, marginRight : 15, borderRadius : 10}}
      />

      <View style = {{justifyContent : "space-around"}}>
        <Text style = {{fontWeight : "600", color : 'black', fontSize : 17}}>{RestaurantFinder(order).name}</Text>
        <Text>2 items &#8226; ${order.total} </Text>
        <Text>2 days ago &#8226; {order.status}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    OrderListRow : {
        display : "flex",
        flexDirection : "row",
        marginVertical : 10
    }
});

export default OrderListItem;
