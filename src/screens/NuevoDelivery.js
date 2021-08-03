import React, {useState, useEffect, useContext} from 'react'
import {ScrollView, View, Text, TextInput, StyleSheet, Pressable, FlatList} from 'react-native'
import RadioGroup from 'react-native-radio-buttons-group';
import { useIsFocused } from '@react-navigation/native'
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BigButton from '../components/BigButton'
import colors from '../utils/colors';
import ListItemBuscarProductos from '../components/ListItemBuscarProductos';
import MyContext from '../utils/MyContext';

const radioButtonsData = [{
    id: '1', 
    label: 'Efectivo',
    value: 'efectivo',
    selected: true
}, {
    id: '2',
    label: 'Prepago',
    value: 'prepago'
}]

function NuevoDelivery(props){

    const [productos, setProductos] = useState([{p:'asd',cantidad: 1},{p:'aaa', cantidad: 4}])
    const [radioButtons, setRadioButtons] = useState(radioButtonsData)
    const [name, setName] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [monto, setMonto] = useState('')
    const [showAlerError, setShowAlertError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const isFocused = useIsFocused()
    const {apiUrl} = useContext(MyContext)

    const onPressRadioButton = radioButtonsArray => {
        setRadioButtons(radioButtonsArray);
    }

    const handlePressMinus = (producto) =>{
        let index = findIndex(producto)
        let productos_ = JSON.parse(JSON.stringify(productos))
        productos_[index].cantidad -=1
        if(!productos_[index].cantidad){
            productos_.splice(index,1)
        }
        setProductos(productos_)
    }

    const handlePressItem = (producto) =>{
        let index = findIndex(producto)
        let productos_ = JSON.parse(JSON.stringify(productos))
        productos_[index].cantidad +=1
        setProductos(productos_)
    }

    const findIndex = producto =>{
        return productos.findIndex(item => (item.p==producto))
    }

    const handlePressListo = async () =>{
        if(parseInt(telefono) != telefono){
            setErrorMsg('El numero de telefono debe ser un numero valido')
            setShowAlertError(true)
            return false
        }
        if(!name.length || !direccion.length){
            setErrorMsg('Debe completar los campos de nombre y direccion')
            setShowAlertError(true)
            return false
        }
        if(parseInt(monto) != monto){
            setErrorMsg('El monto a pagar debe ser un numero valido')
            setShowAlertError(true)
            return false
        }
        if(productos.length === 0){
            setErrorMsg('No se ha añadido ningun producto')
            setShowAlertError(true)
            return false
        }

        let productos_ = ''
        for(let i=0 ; i<productos.length ; i++){
            productos_ += `${productos[i].p} x ${productos[i].cantidad}`
            if(i<productos.length-1){
                productos_ += ' - '
            }
        }
        let efectivo = radioButtons.find(item =>(item.value=='efectivo'))
        let prepago = radioButtons.find(item =>(item.value=='prepago'))
        let medio_pago = ''
        if(efectivo.selected){
            medio_pago = 'efectivo'
        }else if(prepago.selected){
            medio_pago = 'prepago'
        }else{
            setErrorMsg('Debe elegir un medio de pago')
            setShowAlertError(true)
            return false
        }
        
        
        let jwt = await AsyncStorage.getItem('jwt')
        let response = await fetch(`${apiUrl}/envios`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization':'Bearer '+ jwt},
            body: JSON.stringify({
                client_name: name,
                client_direccion: direccion,
                client_telefono: telefono,
                monto: monto,
                productos: productos_,
                medio_pago: medio_pago 
            })
        })
        if(response.status===401){
            props.navigation.navigate('Login')
        }else if(response.status===500){
            setErrorMsg('Ha ocurrido un error enviando el pedido')
            setShowAlertError(true) 
        }else if(response.status===200){
            props.navigation.goBack()
        }
        
    }

    useEffect(()=>{
        if(props.route.params){
            setName(props.route.params.cliente.name)
            setDireccion(props.route.params.cliente.direccion)
            setTelefono(props.route.params.cliente.telefono)
            setProductos(props.route.params.productos)
            setMonto(props.route.params.monto)
        }
    },[isFocused])

    return(
        <View style={styles.screencontainer}>
            <ScrollView style={styles.container}>
                <Pressable style={styles.usarcliente} onPress={()=>{props.navigation.navigate('Buscar cliente',{productos, monto})}}>
                    <Text style={styles.text}>Usar cliente guardado</Text>
                </Pressable>

                <TextInput onChangeText={t=>{setName(t)}} defaultValue={name} placeholder='Nombre' placeholderTextColor='gray' style={styles.input} />
                <TextInput onChangeText={t=>{setDireccion(t)}} defaultValue={direccion} placeholder='Direccion' placeholderTextColor='gray' style={styles.input} />
                <TextInput onChangeText={t=>{setTelefono(t)}} defaultValue={telefono} placeholder='Telefono' placeholderTextColor='gray' style={styles.input} />
                <TextInput onChangeText={t=>{setMonto(t)}} defaultValue={monto} placeholder='$ Monto (sin delivery)' placeholderTextColor='gray' style={styles.input} />

                <RadioGroup 
                    containerStyle={styles.radio}
                    radioButtons={radioButtons} 
                    onPress={onPressRadioButton} 
                />

                <Pressable style={styles.usarcliente} onPress={()=>{props.navigation.navigate('Buscar producto',{cliente:{name,direccion,telefono},productos, monto})}}>
                    <Text style={styles.text}>Añadir producto</Text>
                </Pressable>

                <View style={styles.list}>
                    {
                        productos.map(item=>(
                            
                            <ListItemBuscarProductos 
                                onPressMinus={handlePressMinus} 
                                onPress={handlePressItem} 
                                cantidad={item.cantidad} 
                                producto={item.p} 
                                index={findIndex(item.p)}
                                key={findIndex(item.p)}
                            />
                        ))
                    }
                </View>
            </ScrollView>
            <BigButton onPress={handlePressListo} text='Listo' />
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
    screencontainer:{
        flex: 1
    },
    input:{
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
        margin: 20,
        marginTop: 0,
        borderRadius: 5,
        textAlign: 'center',
        color: 'black'
    },
    radio:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    usarcliente:{
        backgroundColor: colors.green,
        margin: 20,
        padding: 10,
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        height: 80
    },
    text:{
        fontSize: 20,
        marginLeft: 20,
        fontWeight: 'bold'
    },
    list:{
        margin:20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10
    }
})

export default NuevoDelivery