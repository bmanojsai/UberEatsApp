//packages
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useBasketContext} from '../../contexts/BasketContext';

const BasketDishItem = ({basketDish, total, deliveryFee, type}) => {
  const {dishFinder} = useBasketContext();

  return (
    <View style={styles.quantityRow}>
      {total ?? (
        <View style={styles.quantityNum}>
          <Text style={{color: 'black'}}>{basketDish.quantity}</Text>
        </View>
      )}

      <Text style={{fontWeight: '500', color: 'black'}}>
        {total ? 'Delivery Fee' : dishFinder(basketDish, type).name}
      </Text>
      <Text style={{marginLeft: 'auto', fontWeight: '500', color: 'black'}}>
        {total ? `$ ${deliveryFee}` : `$ ${dishFinder(basketDish, type).price}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default BasketDishItem;
