import React,{useState, useContext} from 'react'
import {View, Text, StyleSheet, Pressable, Dimensions} from 'react-native'
import IconsFeather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import IconsCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AwesomeAlert from 'react-native-awesome-alerts'

import colors from '../utils/colors'
import MyContext from '../utils/MyContext'

const screenWidth = Dimensions.get('screen').width

function MiNegocio(props){

    const [showAlertPrivate, setShowAlertPrivate] = useState(false)
    const {apiUrl} = useContext(MyContext)

    const handlePressProductos = async ()=>{
        let jwt = await AsyncStorage.getItem('jwt')
        let response = await fetch(`${apiUrl}/isadmin`,{
            headers: {'Authorization': 'Bearer '+ jwt}
        })
        if(response.status === 401){
            props.navigation.navigate('Login')
        }else{
            response = await response.json()
            if(response.auth){
                props.navigation.navigate('Editar productos')
            }else{
                setShowAlertPrivate(true)
            }
        }
    }
    const handlePressClientes = async ()=>{
        let jwt = await AsyncStorage.getItem('jwt')
        let response = await fetch(`${apiUrl}/isadmin`,{
            headers: {'Authorization': 'Bearer '+ jwt}
        })
        if(response.status === 401){
            props.navigation.navigate('Login')
        }else{
            response = await response.json()
            if(response.auth){
                props.navigation.navigate('Editar clientes')
            }else{
                setShowAlertPrivate(true)
            }
        }
    }
    const handlePressSalir = async () =>{
        await AsyncStorage.setItem('jwt','')
        props.navigation.navigate('Login')
    }

    return(
        <View style={styles.container}>
            <Pressable style={styles.item} onPress={handlePressProductos}>
                <Text style={styles.text}> Editar productos </Text>
                <IconsFeather style={styles.icon} name='shopping-cart' size={45} color='black' />
            </Pressable>

            <Pressable style={styles.item} onPress={handlePressClientes}>
                <Text style={styles.text}> Editar clientes </Text>
                <Ionicons style={styles.icon} name='people' size={45} color='black' />
            </Pressable>

            <Pressable onPress={handlePressSalir} style={styles.item}>
                <Text style={styles.text}> Mi cuenta </Text>
                <IconsCommunity style={styles.icon} name='account' size={45} color='black' />
            </Pressable>

            <AwesomeAlert
                show={showAlertPrivate}
                showProgress={false}
                title="Area protegida"
                message='Debes ser administrador para poder ingresar a esta area'
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="Continuar"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    setShowAlertPrivate(false)
                }}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        paddingTop:40
    },
    item:{
        backgroundColor: colors.blue,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: screenWidth-40,
        margin: 20,
        padding: 20,
        borderRadius: 9
    },
    icon:{
        marginRight: 20
    },
    text:{
        fontWeight: 'bold',
        fontSize: 20
    }
})

export default MiNegocio