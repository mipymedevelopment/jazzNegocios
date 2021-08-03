import React, {useState,useEffect,useContext} from 'react'
import {View, TextInput, StyleSheet, FlatList, Pressable, Text} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import MyContext from '../utils/MyContext'
import colors from '../utils/colors'
import levenshtein from '../utils/levenshtein'

function BuscarCliente(props){

    const [clientes, setClientes] = useState([])
    const [filtrados, setFiltrados] = useState([])
    const {apiUrl} = useContext(MyContext)

    const loadClients = async () =>{
        let jwt = await AsyncStorage.getItem('jwt')
        let response = await fetch(`${apiUrl}/clientes`,{
            headers: {'Authorization': 'Bearer '+ jwt}
        })
        if(response.status === 401){
            props.navigation.navigate('Login')
        }else if(response.status === 200){
            response = await response.json()
            setClientes(response.clientes)
            setFiltrados(response.clientes)
            
        }
    }

    const handleChangeSearch = text =>{
        
        if(!text){
            setFiltrados(JSON.parse(JSON.stringify(clientes)))
            return false
        }
        let cercanos = []
        clientes.forEach(cliente =>{
            let distancia_name = levenshtein(cliente.name,text)
            let distancia_telefono = levenshtein(cliente.telefono,text)
            let distancia_min = distancia_telefono<=2?distancia_telefono:distancia_name

            if( distancia_name<=10 || distancia_telefono<=2 ){
                cercanos.push({c: cliente, distancia:distancia_min})
            }
        })
        cercanos.sort( (a,b) => (a.distancia>b.distancia))
        setFiltrados(cercanos.map(item =>(item.c)))
        
    }

    const handlePressItem = (cliente) =>{
        props.navigation.navigate('Nuevo delivery',{cliente,productos:props.route.params.productos, monto:props.route.params.monto})
    }

    useEffect(()=>{
        loadClients()
    },[])

    return(
        <View style={styles.container}>
            <TextInput onChangeText={t=>(handleChangeSearch(t))} style={styles.input} placeholder='Buscar' placeholderTextColor='gray' />
            
            <FlatList 
                style={styles.list}
                data={filtrados}
                renderItem={({item, index}) => 
                            <Pressable onPress={()=>{handlePressItem(item)}} style={index%2?styles.item:styles.item_painted}>
                                <Text style={styles.item_text}>{item.name}</Text> 
                            </Pressable> }
                keyExtractor={item=>item.telefono+item.name+item.direccion}
            />
        </View>
    )
}

const styles = StyleSheet.create({
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
    item_painted:{
        backgroundColor: colors.list,
        margin: 3,
        padding: 5
    },
    item:{
        margin: 3,
        padding: 5
    },
    item_text:{
        fontWeight: 'bold'
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

export default BuscarCliente