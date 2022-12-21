import {View, Text, StyleSheet, Image} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const OrderItem = ({order}) => {
  return (
    <View style={styles.OrderItem}>
      <Image source={{uri: order.Restaurant.image}} style={styles.image} />
      <View
        style={{
          margin: 10,

          flex: 1,
        }}>
        <Text style={styles.title}>{order.Restaurant.name}</Text>
        <Text style={styles.description}>{order.Restaurant.address}</Text>
        <Text style={styles.title}>Delivery Details</Text>

        <Text style={styles.description}>{order.User.name}</Text>
        <Text style={styles.description}>{order.User.address}</Text>
      </View>

      <View style={styles.CheckIcon}>
        <Entypo name="check" size={40} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '25%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden',
  },
  OrderItem: {
    display: 'flex',
    flexDirection: 'row',
    borderColor: '#3fc060',
    borderWidth: 2,
    borderRadius: 12,
    margin: 10,
  },
  title: {
    fontWeight: '600',
    fontSize: 17,
    color: 'black',
    marginTop: 5,
  },
  description: {
    fontSize: 15,
  },
  CheckIcon: {
    backgroundColor: '#3FC060',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    display: 'flex',
  },
});

export default OrderItem;
