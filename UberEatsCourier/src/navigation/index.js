import {View} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OrderDeliveryScreen from '../screens/OrderDelivery'
import OrderScreen from '../screens/OrderScreen'

const RootStack =createNativeStackNavigator();

const RootNavigation = () => {
    return (
        <RootStack.Navigator screenOptions={{headerShown : false}}>
            <RootStack.Screen name='Orders' component={OrderScreen} />
            <RootStack.Screen name='OrderDelivery' component={OrderDeliveryScreen} />
        </RootStack.Navigator>
    )
};

export default RootNavigation;