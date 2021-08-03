import React, {useState, useEffect, useContext} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import MyContext from '../utils/MyContext'

function EnvioDetalle(props){

    const [envio, setEnvio] = useState({})
    const {apiUrl} = useContext(MyContext)

    const loadEnvio = async ()=>{
        let jwt = await AsyncStorage.getItem('jwt')
        let response = await fetch(`${apiUrl}/enviobyid?id=${props.route.params.id}`,{
            headers:{'Authorization': 'Bearer ' + jwt}
        })
        if(response.status===401){
            props.navigation.navigate('Login')
        }else if(response.status===200){
            response = await response.json()
            setEnvio(response)
        }
    }

    const transformState = state =>{
        if(state == 'waiting'){
            return 'Esperando repartidor'
        }
        if(state == 'encurso'){
            return 'En reparto'
        }
        if(state == 'entregado'){
            return 'Entregado'
        }
    }

    useEffect(()=>{
        loadEnvio()
    },[])

    return(
        <View style={styles.container}>
        
            <Text style={styles.title}>Cliente</Text>
                <Text style={styles.text}>Nombre: {envio.name}</Text>
                <Text style={styles.text}>Direccion: {envio.address}</Text>
                <Text style={styles.text}>Telefono: {envio.phone}</Text>
            <Text style={styles.title}>Pedido</Text>
                <Text style={styles.text}>Productos: {envio.items}</Text>
                <Text style={styles.text}>Coste (sin delivery): {envio.price}</Text>
                <Text style={styles.text}>Medio de pago: {envio.payment}</Text>
                <Text style={styles.text}>Estado: {transformState(envio.state)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title:{
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 10
    },
    text:{
        fontSize: 15,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 5
    },
    container:{
        padding:40
    }
})

export default EnvioDetalle