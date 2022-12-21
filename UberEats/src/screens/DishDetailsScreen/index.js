//packages
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import ImmersiveMode from 'react-native-immersive-mode';
import {useIsFocused} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {DataStore} from 'aws-amplify';
import {Dish} from '../../models/index';

//json
import Restaurants from '../../../assets/data/restaurants.json';
import {ActivityIndicator} from 'react-native-paper';
import {useBasketContext} from '../../contexts/BasketContext';
const dish = Restaurants[0].dishes[0];

const DishDetailsScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const [itemsCount, setItemsCount] = useState(1);
  const [dish, setDish] = useState(null);

  const id = route.params.id;

  const fetchDishDetials = async () => {
    if (id) {
      const response = await DataStore.query(Dish, id);
      setDish(response);
    }
  };

  useEffect(() => {
    if (isFocused) {
      ImmersiveMode.fullLayout(false);
      ImmersiveMode.setBarTranslucent(false);
    }
  }, [isFocused]);

  useEffect(() => {
    fetchDishDetials();
  }, []);

  const onMinus = () => {
    if (itemsCount > 1) {
      setItemsCount(itemsCount - 1);
    }
  };

  const onPlus = () => {
    setItemsCount(itemsCount + 1);
  };

  const getTotal = () => {
    return (itemsCount * dish.price).toFixed(2);
  };

  const {addDishToBasket} = useBasketContext();

  const onAddToBasket = async () => {
    try {
      await addDishToBasket(dish, itemsCount);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error : ', err.message);
    }
  };

  if (!dish) {
    return <ActivityIndicator style={{flex: 1}} size={50} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.dishDetailsBox}>
        <Text style={styles.name}>{dish.name}</Text>
        <Text style={styles.description}>{dish.description}</Text>
      </View>
      <View style={styles.seperator}></View>

      <View style={styles.countContainer}>
        <AntDesign
          name="minuscircleo"
          size={45}
          color="black"
          onPress={onMinus}
        />
        <Text style={styles.count}>{itemsCount}</Text>
        <AntDesign
          name="pluscircleo"
          size={45}
          color="black"
          onPress={onPlus}
        />
      </View>

      <Pressable style={styles.addToCartButton} onPress={() => onAddToBasket()}>
        <Text style={styles.addToCartButtonText}>
          Add {itemsCount} items to basket &#8226; ${getTotal()}
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
    fontSize: 30,
    color: 'black',
    fontWeight: '600',
    marginVertical: 10,
  },
  description: {
    color: '#696969',
    fontSize: 15,
  },
  seperator: {
    height: 2,
    backgroundColor: 'lightgrey',
    marginVertical: 10,
  },
  count: {
    fontSize: 27,
    fontWeight: '600',
    color: 'black',
    marginHorizontal: 20,
  },
  countContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
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
});

export default DishDetailsScreen;
