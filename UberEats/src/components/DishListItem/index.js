import React from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';


const DishListItem = ({dish, navigation}) => {
  return (
    <Pressable style={styles.ListItemcontainer} onPress = {() => navigation.navigate('Dish',{id : dish.id})}>
      <View style={{flex: 1}}>
        <Text style={styles.name}>{dish.name}</Text>
        <Text style={styles.description}>{dish.description}</Text>
        <Text style={styles.price}>$ {dish.price}</Text>
      </View>

      {dish.image && <Image source={{uri: dish.image}} style={styles.image} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  ListItemcontainer: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    paddingVertical: 20,
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    letterSpacing: 0.5,
  },
  description: {
    color: 'grey',
    marginVertical: 5,
  },
  price: {
    fontSize: 17,
    color: 'black',
  },
  image: {
    width: 100,
    aspectRatio: 1 / 1,
    borderRadius: 10,
  },
});

export default DishListItem;
