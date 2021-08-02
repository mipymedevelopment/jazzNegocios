import 'react-native-gesture-handler'

import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import MiNegocio from './src/screens/MiNegocio';
import EditarProductos from './src/screens/EditarProductos';
import AnadirProducto from './src/screens/AnadirProducto';
import EditarClientes from './src/screens/EditarClientes';
import AnadirCliente from './src/screens/AnadirCliente';
import Editar1Cliente from './src/screens/Editar1Cliente';

import NuevoDelivery from './src/screens/NuevoDelivery';
import BuscarCliente from './src/screens/BuscarCliente';
import BuscarProducto from './src/screens/BuscarProductos';

import Main from './src/screens/Main'
import Login from './src/screens/Login'

import MyContext from './src/utils/MyContext'
import colors from './src/utils/colors'

const App = () => {

  const Stack = createStackNavigator()

  return (
    <MyContext.Provider value={{apiUrl:'http://10.0.2.2:4001'}}>
        <NavigationContainer>
        <Stack.Navigator screenOptions={{headerTitleAlign:'center', headerStyle:{backgroundColor:colors.orange}}}>
          <Stack.Screen name='Login' component={Login} options={{headerShown: false}} />  
          <Stack.Screen name='Main' component={Main} options={{headerShown: false}} />  
          <Stack.Screen name='Mi negocio' component={MiNegocio}/>  
          <Stack.Screen name='Editar productos' component={EditarProductos}/>  
          <Stack.Screen name='Añadir producto' component={AnadirProducto}/>  
          <Stack.Screen name='Editar clientes' component={EditarClientes}/>  
          <Stack.Screen name='Añadir cliente' component={AnadirCliente}/>  
          <Stack.Screen name='Editar cliente' component={Editar1Cliente}/>  
          <Stack.Screen name='Nuevo delivery' component={NuevoDelivery}/>  
          <Stack.Screen name='Buscar cliente' component={BuscarCliente}/>  
          <Stack.Screen name='Buscar producto' component={BuscarProducto}/>  
        </Stack.Navigator>  
      </NavigationContainer>
    </MyContext.Provider>
  )
}

export default App;
