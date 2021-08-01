import React,{useState, useContext} from 'react'
import {View, TextInput, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AwesomeAlert from 'react-native-awesome-alerts'

import BigButton from '../components/BigButton'
import MyContext from '../utils/MyContext'

function AnadirProducto(props){

    const [producto, setProducto] = useState('')
    const [showAlertSuccess, setShowAlertSuccess] = useState(false)
    const [showAlertFailure, setShowAlertFailure] = useState(false)
    const {apiUrl} = useContext(MyContext)

    const handlePressAnadir = async () =>{
        let jwt = await AsyncStorage.getItem('jwt')
        let response = await fetch(`${apiUrl}/addproduct`,{
            method:'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer '+jwt},
            body: JSON.stringify({
                producto: producto
            })
        })
        if(response.status === 401){
            props.navigation.navigate('Login')
        }else if(response.status === 500){
            setShowAlertFailure(true)
        }else if(response.status === 200){
            setShowAlertSuccess(true)
        }
    }

    return(
        <View style={styles.container}> 
            <TextInput onChangeText={t=>{setProducto(t)}} defaultValue={producto} style={styles.input} placeholder='Nuevo producto' placeholderTextColor='gray' />
            <BigButton onPress={handlePressAnadir} style={styles.button}  text='Añadir' />
            <AwesomeAlert
                show={showAlertSuccess}
                showProgress={false}
                title="Notificacion"
                message='El producto se ha añadido correctamente.'
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="Continuar"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    setShowAlertSuccess(false)
                    props.navigation.goBack()
                }}
                />
                <AwesomeAlert
                show={showAlertFailure}
                showProgress={false}
                title="Error"
                message='Ha ocurrido un error y el producto no se ha podido guardar.'
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="Continuar"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    setShowAlertFailure(false)
                }}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
    input:{
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        margin: 40,
        marginTop: 80,
        textAlign: 'center'
    },
    button:{
        position:'absolute',
        bottom: 0
    }
})

export default AnadirProducto