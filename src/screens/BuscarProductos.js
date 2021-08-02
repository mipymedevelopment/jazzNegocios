import React, {useState,useEffect,useContext} from 'react'
import {View, TextInput, StyleSheet, FlatList, Pressable, Text} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import MyContext from '../utils/MyContext'
import levenshtein from '../utils/levenshtein'
import ListItemBuscarProductos from '../components/ListItemBuscarProductos'
import BigButton from '../components/BigButton'

function BuscarProducto(props){

    const [productos, setProductos] = useState([])
    const [filtrados, setFiltrados] = useState([])
    const {apiUrl} = useContext(MyContext)

    const loadProducts = async () =>{
        let jwt = await AsyncStorage.getItem('jwt')
        let response = await fetch(`${apiUrl}/productos`,{
            headers: {'Authorization': 'Bearer '+ jwt}
        })
        if(response.status === 401){
            props.navigation.navigate('Login')
        }else if(response.status === 200){
            response = await response.json()
            setProductos( response.productos.map(item=>({p:item, cantidad: 0})) )
            setFiltrados(null)
        }
    }

    const filtro = (producto) =>{
        if(!filtrados){
            return true
        }
        let found = filtrados.find(item =>(item == producto))
        return found
    }

    const handleChangeSearch = text =>{
        
        if(!text){
            setFiltrados(null)
            return false
        }
        let cercanos = []
        productos.forEach(item =>{
            let distancia = levenshtein(item.p,text)
            
            if( distancia<=10){
                cercanos.push({p: item.p, distancia:distancia})
            }
        })
        cercanos.sort( (a,b) => (a.distancia>b.distancia))
        setFiltrados(cercanos.map(item =>(item.p)))
    
    }

    const handlePressItem =  (producto) =>{
        let index = productos.findIndex(item =>(item.p == producto))
        let productos_ = JSON.parse(JSON.stringify(productos))
        productos_[index].cantidad += 1
        setProductos(productos_)
    }

    const handlePressMinus =  (producto) =>{
        let index = productos.findIndex(item =>(item.p == producto))
        let productos_ = JSON.parse(JSON.stringify(productos))
        productos_[index].cantidad -= 1
        setProductos(productos_)
    }

    const handlePressAnadir = () =>{
        let productos2send = JSON.parse(JSON.stringify(props.route.params.productos))
        productos.forEach(item =>{
            if(item.cantidad){
                let index=productos2send.findIndex(item2send => (item2send.p==item.p))
                if(index != -1){
                    productos2send[index].cantidad += item.cantidad
                }else{
                    productos2send.push(item)
                }
            }
        })
        props.navigation.navigate('Nuevo delivery', {cliente: props.route.params.cliente, productos: productos2send})
    }

    useEffect(()=>{
        loadProducts()
    },[])

    return(
        <View style={styles.container}>
            <TextInput onChangeText={t=>(handleChangeSearch(t))} style={styles.input} placeholder='Buscar' placeholderTextColor='gray' />
            
            <FlatList 
                style={styles.list}
                data={productos}
                renderItem={({item, index}) => 
                    filtro(item.p) ?
                    <ListItemBuscarProductos 
                        onPressMinus={handlePressMinus} 
                        onPress={handlePressItem} 
                        cantidad={item.cantidad} 
                        producto={item.p} 
                        index={index} 
                    /> : false}
                keyExtractor={item=>item.p}
            />

            <BigButton onPress={handlePressAnadir} text='Añadir' />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    }, 
    input:{
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
        margin: 20,
        marginTop: 40,
        borderRadius: 5,
        textAlign: 'center',
        color: 'black'
    },
    list:{
        height: 200,
        margin: 20,
        padding: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5
    }
}) 

export default BuscarProducto