import React from 'react'
import {ScrollView, View, Text, StyleSheet, Pressable, Dimensions} from 'react-native'
import Icons from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage'

import BigButton from '../components/BigButton'
import colors from '../utils/colors'

const screenHeight = Dimensions.get('screen').height

function Main(props){

    const handlePressMiNegocio = () =>{
        props.navigation.navigate('Mi negocio')
    }
    const handlePressSalir = async () =>{
        await AsyncStorage.setItem('jwt','')
        props.navigation.navigate('Login')
    }

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>JazzNegocios!</Text>
                <Pressable onPress={handlePressMiNegocio} style={styles.minegociocontainer}>
                    <Text style={styles.miNegocio}>Mi negocio</Text>
                    <Icons name='setting' size={20} color='black'/>
                </Pressable>
            </View>
            <Pressable onPress={handlePressSalir}><Text>SAlir</Text></Pressable>

            <BigButton onPress={()=>{props.navigation.navigate('Nuevo delivery')}} style={styles.nuevoPedido} text='Nuevo pedido' />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        height: screenHeight,
        position: 'relative'
    },
    header:{
        backgroundColor: colors.orange,
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        padding: 15,
        alignItems: 'center'
    },
    title:{
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 20,
        color: colors.text
    },
    minegociocontainer:{
        display: 'flex',
        flexDirection: 'row',
        marginRight: 15
    },
    miNegocio:{
        marginRight:4,
        color: colors.text
    },
    nuevoPedido:{
        position: 'absolute',
        bottom: 70
    }
})

export default Main