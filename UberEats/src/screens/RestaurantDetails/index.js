//packages
import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, FlatList, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImmersiveMode from 'react-native-immersive-mode';
import {useIsFocused} from '@react-navigation/native';
import {DataStore} from 'aws-amplify';
import {Dish, Restaurant} from '../../models';

//components
import DishListItem from '../../components/DishListItem';
import DetailsHeader from './Header';
import {ActivityIndicator} from 'react-native-paper';
import {useBasketContext} from '../../contexts/BasketContext';

//json
//import Restaurants from '../../../assets/data/restaurants.json';
//const restaurant = Restaurants[0];

const RestaurentDetails = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState(null);
  const {setRestaurant: setBasketRestaurant, basket, basketDishes} = useBasketContext();

  const id = route.params.id;

  const fetchRestaurantDetailsById = async () => {
    const result = await DataStore.query(Restaurant, id);
    setRestaurant(result);

    const response = await DataStore.query(Dish, dish =>
      dish.restaurantID.eq(id),
    );
    setDishes(response);
  };

  useEffect(() => {
    if (isFocused) {
      ImmersiveMode.fullLayout(true);
      ImmersiveMode.setBarTranslucent(true);
    }
  }, [isFocused]);

  useEffect(() => {
    if (id) {
      fetchRestaurantDetailsById();
    }
    setBasketRestaurant(null);
  }, []);

  useEffect(() => {
    if (restaurant) {
      setBasketRestaurant(restaurant);
    }
  }, [restaurant]);

  if (!restaurant) {
    return <ActivityIndicator style={{flex: 1}} size={50} />;
  }

  return (
    <View style={styles.container}>
      <Ionicons
        style={styles.iconContainer}
        name="arrow-back-circle"
        size={45}
        color="#fff"
        onPress={() => navigation.goBack()}
      />

      <FlatList
        data={dishes}
        renderItem={({item}) => (
          <DishListItem dish={item} navigation={navigation} />
        )}
        ListHeaderComponent={() => <DetailsHeader restaurant={restaurant} />}
        keyExtractor={item => item.name}
        ListFooterComponent = {() => (<View style = {{height : 100}}></View>)}
      />

      {basket && (
        <Pressable
          style={styles.addToCartButton}
          onPress={() => navigation.navigate('Basket')}>
          <Text style={styles.addToCartButtonText}>View Basket - {basketDishes.length} items</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    position: 'absolute',
    top: 25,
    left: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
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
    position: 'absolute',
    bottom: 25,
    width: '85%',
    alignSelf: 'center',
  },
});

export default RestaurentDetails;
