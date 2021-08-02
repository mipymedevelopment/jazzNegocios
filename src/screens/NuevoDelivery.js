import React, {useState, useEffect} from 'react'
import {ScrollView, View, Text, TextInput, StyleSheet, Pressable, FlatList} from 'react-native'
import RadioGroup from 'react-native-radio-buttons-group';
import { useIsFocused } from '@react-navigation/native'

import BigButton from '../components/BigButton'
import colors from '../utils/colors';
import ListItemBuscarProductos from '../components/ListItemBuscarProductos';

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
    const isFocused = useIsFocused()

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

    useEffect(()=>{
        if(props.route.params){
            setName(props.route.params.cliente.name)
            setDireccion(props.route.params.cliente.direccion)
            setTelefono(props.route.params.cliente.telefono)
            setProductos(props.route.params.productos)
        }
    },[isFocused])

    return(
        <View style={styles.screencontainer}>
            <ScrollView style={styles.container}>
                <Pressable style={styles.usarcliente} onPress={()=>{props.navigation.navigate('Buscar cliente',{productos})}}>
                    <Text style={styles.text}>Usar cliente guardado</Text>
                </Pressable>

                <TextInput onChangeText={t=>{setName(t)}} defaultValue={name} placeholder='Nombre' placeholderTextColor='gray' style={styles.input} />
                <TextInput onChangeText={t=>{setDireccion(t)}} defaultValue={direccion} placeholder='Direccion' placeholderTextColor='gray' style={styles.input} />
                <TextInput onChangeText={t=>{setTelefono(t)}} defaultValue={telefono} placeholder='Telefono' placeholderTextColor='gray' style={styles.input} />
                <TextInput placeholder='$ Monto (sin delivery)' placeholderTextColor='gray' style={styles.input} />

                <RadioGroup 
                    containerStyle={styles.radio}
                    radioButtons={radioButtons} 
                    onPress={onPressRadioButton} 
                />

                <Pressable style={styles.usarcliente} onPress={()=>{props.navigation.navigate('Buscar producto',{cliente:{name,direccion,telefono},productos})}}>
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
            <BigButton text='Listo' />
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
        margin:20
    }
})

export default NuevoDelivery