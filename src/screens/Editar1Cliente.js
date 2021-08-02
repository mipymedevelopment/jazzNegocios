import React,{useState, useEffect, useContext} from 'react'
import {Pressable, View, TextInput, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AwesomeAlert from 'react-native-awesome-alerts'
import Icons from 'react-native-vector-icons/Feather'

import BigButton from '../components/BigButton'
import MyContext from '../utils/MyContext'


function AnadirCliente(props){
    
    const [name, setName] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [showAlertSuccess, setShowAlertSuccess] = useState(false)
    const [showAlertFailure, setShowAlertFailure] = useState(false)
    const [showAlertSameTelephone, setShowAlertSameTelephone] = useState(false)
    const [showAlertBadTelephone, setShowAlertBadTelephone] = useState(false)
    const [showAlertDelete, setShowAlertDelete] = useState(false)
    const {apiUrl} = useContext(MyContext)

    const handlePressEditar = async () =>{

        if(parseInt(telefono) != telefono){
            setShowAlertBadTelephone(true)
            return false
        }

        if(await compareWithClients(telefono)){
            setShowAlertSameTelephone(true)
            return false
        }

        let jwt = await AsyncStorage.getItem('jwt')
        let response = await fetch(`${apiUrl}/editclient`,{
            method:'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer '+jwt},
            body: JSON.stringify({
                new_name: name,
                new_direccion: direccion,
                new_telefono: telefono,
                old_telefono: props.route.params.cliente.telefono
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

    const compareWithClients = async (telefono) =>{
        let jwt = await AsyncStorage.getItem('jwt')
        let response = await fetch(`${apiUrl}/clientes`,{
            headers: {'Authorization': 'Bearer '+ jwt}
        })
        if(response.status === 401){
            props.navigation.navigate('Login')
        }else if(response.status === 200){
            response = await response.json()
            let index = response.clientes.findIndex(c => (
                parseInt(c.telefono)===parseInt(telefono) && c.name!=props.route.params.cliente.name  
            ))
            if(index === -1){
                return false
            }
        }
        return true
    }

    const borrar = async () =>{
        let jwt = await AsyncStorage.getItem('jwt')
        let response = await fetch(`${apiUrl}/removeclient`,{
            method:'DELETE',
            headers: {'Content-Type':'application/json', 'Authorization': 'Bearer '+ jwt},
            body: JSON.stringify({
                telefono: props.route.params.cliente.telefono
            })
        })
        if(response.status===401){
            props.navigation.navigate('Login')
        }else if(response.status===200){
            props.navigation.goBack()
        }
    }

    useEffect(()=>{
        setName(props.route.params.cliente.name)
        setDireccion(props.route.params.cliente.direccion)
        setTelefono(props.route.params.cliente.telefono)
    },[])

    return(
        <View style={styles.container}>
            <TextInput onChangeText={t=>{setName(t)}} defaultValue={name} style={styles.input} placeholder='Nombre' placeholderTextColor='gray' />
            <TextInput onChangeText={t=>{setDireccion(t)}} defaultValue={direccion} style={styles.input} placeholder='Direccion' placeholderTextColor='gray' />
            <TextInput onChangeText={t=>{setTelefono(t)}} defaultValue={telefono} style={styles.input} placeholder='Telefono' placeholderTextColor='gray' />
            <BigButton onPress={handlePressEditar} style={styles.button}  text='Guardar' />
            <Pressable style={styles.trashContainer} onPress={()=>{setShowAlertDelete(true)}}>
                <Icons name='trash-2' size={50} color='red' />
            </Pressable>
            <AwesomeAlert
                show={showAlertSuccess}
                showProgress={false}
                title="Notificacion"
                message='El cliente se ha modificado correctamente.'
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
                message='Ha ocurrido un error y el cliente no se ha podido guardar.'
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
            <AwesomeAlert
                show={showAlertSameTelephone}
                showProgress={false}
                title="Error"
                message='El numero de telefono que intenta guardar ya existe'
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="Continuar"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    setShowAlertSameTelephone(false)
                }}
                />
            <AwesomeAlert
                show={showAlertBadTelephone}
                showProgress={false}
                title="Error"
                message='El numero de telefono que intenta guardar tiene un formato incorrecto.'
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="Continuar"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    setShowAlertBadTelephone(false)
                }}
                />
            <AwesomeAlert
                show={showAlertDelete}
                showProgress={false}
                title="Confirmacino"
                message='¿Desea borrar este cliente?'
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                confirmText="Borralo!"
                cancelText='Mejor no'
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    borrar()
                    setShowAlertDelete(false)
                }}
                onCancelPressed={()=>{
                    setShowAlertDelete(false)
                }}
                />

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: 80
    },
    input:{
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        margin: 20,
        marginLeft: 40,
        marginRight: 40,
        textAlign: 'center'
    },
    button:{
        position:'absolute',
        bottom: 0
    },
    trashContainer:{
        display: 'flex',
        justifyContent:'center',
        alignItems:'center',
        marginTop: 50
    }
})

export default AnadirCliente