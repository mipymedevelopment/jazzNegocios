import React, {useState, useEffect, useContext} from 'react'
import {ScrollView, View, Text, StyleSheet, Pressable, Dimensions, RefreshControl} from 'react-native'
import Icons from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AwesomeAlert from 'react-native-awesome-alerts'
import { useIsFocused } from '@react-navigation/native'

import EnvioItem from '../components/EnvioItem'
import BigButton from '../components/BigButton'
import colors from '../utils/colors'
import MyContext from '../utils/MyContext'

const screenHeight = Dimensions.get('screen').height

function Main(props){

    const [refreshing, setRefreshing] = React.useState(false);
    const [envios, setEnvios] = useState([])
    const [showAlerError, setShowAlertError] = useState(false)
    const [errorMsg, setErroMsg] = useState('')
    const {apiUrl} = useContext(MyContext)
    const isFocused = useIsFocused()

    const handlePressMiNegocio = () =>{
        props.navigation.navigate('Mi negocio')
    }

    const onRefresh = () =>{
        setRefreshing(true)
        loadEnvios()
        setTimeout(() => {
            setRefreshing(false)
        }, 500);
    }
    
    const loadEnvios = async () =>{
        let jwt = await AsyncStorage.getItem('jwt')
        let response = await fetch(`${apiUrl}/envios`,{
            headers: {'Authorization': 'Bearer ' + jwt}
        })
        if(response.status===401){
            props.navigation.navigate('Login')
        }else if(response.status===500){
            setErroMsg('Ha ocurrido un error comunicandose con el servidor. Por favor contactar al administrador')
            setShowAlertError(true)
        }else if(response.status===200){
            response = await response.json()
            setEnvios(response.envios)
        }
    }

    const handlePressItem = (id) =>{
        props.navigation.navigate('Detalle',{id})
    }

    useEffect(()=>{
        loadEnvios()
    },[isFocused])


    return(
        <View style={styles.container} >
            <View style={styles.header}>
                <Text style={styles.title}>JazzNegocios!</Text>
                <Pressable onPress={handlePressMiNegocio} style={styles.minegociocontainer}>
                    <Text style={styles.miNegocio}>Mi negocio</Text>
                    <Icons name='setting' size={20} color='black'/>
                </Pressable>
            </View>

            <ScrollView style={styles.list} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> }>
                {
                    envios.map(e =>(
                        <EnvioItem envio={e} key={e._id} onPress={handlePressItem} />
                    ))
                }
            </ScrollView>

            <BigButton onPress={()=>{props.navigation.navigate('Nuevo delivery')}} style={styles.nuevoPedido} text='Nuevo pedido' />
            <AwesomeAlert
                show={showAlerError}
                showProgress={false}
                title="Error"
                message={errorMsg}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="Continuar"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    setShowAlertError(false)
                }}
                />
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
    },
    list:{
        margin: 20,
        maxHeight: screenHeight-230
    }
})

export default Main