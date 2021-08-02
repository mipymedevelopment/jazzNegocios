import React,{useState, useEffect, useContext} from 'react'
import {View, Text, TextInput, Pressable,FlatList, StyleSheet} from 'react-native'
import Icons from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import AwesomeAlert from 'react-native-awesome-alerts'

import ListItem from '../components/ListItem'
import colors from '../utils/colors'
import MyContext from '../utils/MyContext'
import levenshtein from '../utils/levenshtein'

function EditarProductos(props){

    const [toRemove, setToRemove] = useState('')
    const [showAlertRemove, setShowAlertRemove] = useState(false)
    const [showAlertFailure, setShowAlertFailure] = useState(false)
    const [selected, setSelected] = useState(1)
    const [filtrados, setFiltrados] = useState([])
    const [productos, setProductos] = useState([])
    const {apiUrl} = useContext(MyContext)
    const isFocused = useIsFocused()

    const loadProducts = async () =>{
        let jwt = await AsyncStorage.getItem('jwt')
        let response = await fetch(`${apiUrl}/productos`,{
            headers: {'Authorization': 'Bearer '+ jwt}
        })
        if(response.status === 401){
            props.navigation.navigate('Login')
        }else if(response.status === 200){
            response = await response.json()
            setProductos(response.productos.map(p=>({p})))
            setFiltrados(response.productos.map(p=>({p})))
        }
    }

    const handleChangeSearch = text =>{
        setSelected(null)
        if(!text){
            setFiltrados(JSON.parse(JSON.stringify(productos)))
            return false
        }
        let cercanos = []
        productos.forEach(producto =>{
            let distancia = levenshtein(producto.p,text)
            if( distancia <= 10){
                cercanos.push({p: producto.p, distancia})
            }
        })
        cercanos.sort( (a,b) => (a.distancia>b.distancia))
        setFiltrados(cercanos.map(item=>({p:item.p})))
        
    }

    const handlePressRemove = (producto) =>{
        setToRemove(producto)
        setShowAlertRemove(true)
    }

    const removeProduct = async () =>{
        let jwt = await AsyncStorage.getItem('jwt')
        let response = await fetch(`${apiUrl}/removeproduct`,{
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer '+jwt},
            body: JSON.stringify({
                producto: toRemove
            })
        })
        if(response.status===401){
            props.navigation.navigate('Login')
        }else if(response.status===500){
            setShowAlertFailure(true)
        }else if(response.status===200){
            loadProducts()
        }
    }

    const setSelectedWrapper = index =>{
        setSelected(index)
    }

    useEffect(()=>{
        loadProducts()
        setSelected(null)
    },[isFocused])

    return(
        <View style={styles.container}>
            <Pressable style={styles.botonAnadir} onPress={()=>{props.navigation.navigate('Añadir producto')}}>
                <Text style={styles.textAnadir} >Añadir producto</Text>
                <Icons style={styles.iconAnadir} name='pluscircleo' size={30} color={colors.text} />
            </Pressable>

            <TextInput onChangeText={t=>{handleChangeSearch(t)}} style={styles.input} placeholderTextColor='gray' placeholder='Buscar'/>

            <FlatList 
                style={styles.list}
                data={filtrados}
                renderItem={({item, index}) => <ListItem onRemove={handlePressRemove} onPress={setSelectedWrapper} selected={selected} producto={item.p} index={index} />}
                keyExtractor={item=>item.p}
            />
            <AwesomeAlert
                show={showAlertRemove}
                showProgress={false}
                title="Confirmacion"
                message='¿Desea eliminar este producto de la lista?'
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                confirmText="Eliminalo!"
                cancelText='Mejor no'
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    removeProduct()
                    setShowAlertRemove(false)
                }}
                onCancelPressed={()=>{
                    setShowAlertRemove(false)
                }}
                />
                <AwesomeAlert
                show={showAlertFailure}
                showProgress={false}
                title="Error"
                message='Ha ocurrido un error mientras se eliminaba el producto'
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
    botonAnadir:{
        backgroundColor: colors.blue,
        margin: 20,
        padding: 10,
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        height: 80
    },
    textAnadir:{
        fontSize: 20,
        marginLeft: 20
    },
    iconAnadir:{
        marginRight: 20
    },
    list:{
        height:200,
        margin: 20,
        padding: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5
    },
    input:{
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
        margin: 20,
        borderRadius: 5,
        textAlign: 'center',
        color: 'black'
    }
})

export default EditarProductos