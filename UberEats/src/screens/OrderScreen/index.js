//packages
import React from "react";
import {View, Text, FlatList, StyleSheet, ActivityIndicator} from 'react-native';

//components
import OrderListItem from "../../components/OrderListItem";


//json
import Orders from "../../../assets/data/orders.json";
import { useOrderContext } from "../../contexts/OrderContext";
import { useBasketContext } from "../../contexts/BasketContext";

const OrderScreen = ({navigation}) => {

    const {orders,RestaurantFinder} = useOrderContext();

    if(!orders){
        return <ActivityIndicator size={50} style = {{flex : 1}} />
    }

    return (
        <View style = {styles.container}>

            <FlatList
            data={orders}
            renderItem = {({item}) => <OrderListItem order = {item} navigation ={navigation} /> }
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container : {
        flex : 1,
        width : "100%",
        paddingHorizontal  :15
    }
})



export default OrderScreen;