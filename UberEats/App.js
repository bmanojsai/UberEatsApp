//packages
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Amplify} from 'aws-amplify';
import config from './src/aws-exports';
import {withAuthenticator} from 'aws-amplify-react-native';
import AuthContextProvider from './src/contexts/AuthContext';
import BasketContextProvider from './src/contexts/BasketContext';
import OrderContextProvider from './src/contexts/OrderContext';

Amplify.configure({...config, Analytics: {disabled: true}});

//components
import HomeTabs from './src/navigation';

const App = () => {
  return (
    <NavigationContainer>
      <AuthContextProvider>
        <BasketContextProvider>
          <OrderContextProvider>
            <HomeTabs />
          </OrderContextProvider>
        </BasketContextProvider>
      </AuthContextProvider>
    </NavigationContainer>
  );
};

export default withAuthenticator(App);
