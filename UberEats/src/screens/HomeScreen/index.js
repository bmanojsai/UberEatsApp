//packages
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View, Pressable} from 'react-native';
import ImmersiveMode from 'react-native-immersive-mode';
import {useIsFocused} from '@react-navigation/native';
import {DataStore} from 'aws-amplify';
import {Restaurant} from "../../models/index";

//components
import RestaurantItem from '../../components/RestaurantItem/index';

//json
//import restaurants from '../../../assets/data/restaurants.json';


const HomeScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const [restaurants, setRestaurants] = useState([])

  const fetchRestaurants = async() => {
    try{
      const result = await DataStore.query(Restaurant);
      setRestaurants(result);
    }catch(error){
      console.log(error);
    }
    
  };

  useEffect(() => {
    if (isFocused) {
      ImmersiveMode.fullLayout(false);
      ImmersiveMode.setBarTranslucent(false);
    }
  }, [isFocused]);


  useEffect(( ) => {
    fetchRestaurants();
  },[]);

  return (
    <View styles={styles.container}>
      <FlatList
        data={restaurants}
        renderItem={({item}) => <RestaurantItem restaurant={item} navigation = {navigation} />}
        showsVerticalScrollIndicator={false}
        style = {{marginHorizontal : 10}}
        keyExtractor = {(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default HomeScreen;
