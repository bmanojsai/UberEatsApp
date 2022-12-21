//packages
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import ImmersiveMode from 'react-native-immersive-mode';
import {useIsFocused} from '@react-navigation/native';

//components
import BasketDishItem from '../../components/BasketDish';

//json
import Restaurants from '../../../assets/data/restaurants.json';
const restaurant = Restaurants[0];
import {useBasketContext} from '../../contexts/BasketContext';
import { useOrderContext } from '../../contexts/OrderContext';

const BasketScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const {basket, basketDishes, restaurant, totalPrice} = useBasketContext();
  const {CreateOrder} = useOrderContext();
  
  useEffect(() => {
    if (isFocused) {
      ImmersiveMode.fullLayout(false);
      ImmersiveMode.setBarTranslucent(false);
    }
  }, [isFocused]);

  const onPressCreateOrder = async() => {
    await CreateOrder();
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.dishDetailsBox}>
        <Text style={styles.name}>{restaurant.name}</Text>
      </View>

      <Text style={styles.ItemText}>Your Items</Text>

      <FlatList
        data={basketDishes}
        renderItem={({item}) => <BasketDishItem basketDish={item} type = "BASKET" />}
        ListFooterComponent={({item}) => (
          <BasketDishItem
            basketDish={item}
            total
            deliveryFee={restaurant.deliveryFee.toFixed(2)}
          />
        )}
      />

      <Pressable style={styles.addToCartButton} onPress = {() => onPressCreateOrder()}>
        <Text style={styles.addToCartButtonText}>
          Create Order - ${totalPrice}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  name: {
    fontSize: 27,
    color: 'black',
    fontWeight: '600',
    marginVertical: 10,
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 18,
  },
  addToCartButton: {
    backgroundColor: 'black',
    marginTop: 'auto',
    alignItems: 'center',
    padding: 20,
    marginBottom: 30,
    marginHorizontal: 30,
  },
  dishDetailsBox: {
    margin: 15,
  },
  ItemText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 15,
    color: 'black',
    marginBottom: 30,
  },
  quantityRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
  },
  quantityNum: {
    backgroundColor: 'lightgrey',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});

export default BasketScreen;
