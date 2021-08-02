import React,{useState, useEffect, useContext} from 'react'
import {View, Text, TextInput, Pressable,FlatList, StyleSheet} from 'react-native'
import Icons from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import colors from '../utils/colors'
import ListItemClientes from '../components/ListItemClientes'

import MyContext from '../utils/MyContext'
import levenshtein from '../utils/levenshtein'

function EditarClientes(props){

    const [clientes, setClientes] = useState([])
    const [filtrados, setFiltrados] = useState([])
    const [selected, setSelected] = useState(1)
    const isFocused = useIsFocused()
    const {apiUrl} = useContext(MyContext)

    const setSelectedWrapper = index =>{
        setSelected(index)
    }


    const handleChangeSearch = text =>{
        setSelected(null)
        
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

    const handlePressEdit = (cliente) =>{
        props.navigation.navigate('Editar cliente',{cliente})
    }

    useEffect(()=>{
        loadClients()
        setSelected(null)
    },[isFocused])

    return(
        <View style={styles.container}>
            <Pressable style={styles.botonAnadir} onPress={()=>{props.navigation.navigate('Añadir cliente')}}>
                <Text style={styles.textAnadir} >Añadir cliente</Text>
                <Icons style={styles.iconAnadir} name='pluscircleo' size={30} color={colors.text} />
            </Pressable>

            <TextInput onChangeText={t=>{handleChangeSearch(t)}} style={styles.input} placeholderTextColor='gray' placeholder='Buscar'/>

            <FlatList 
                style={styles.list}
                data={filtrados}
                renderItem={({item, index}) => <ListItemClientes onEdit={handlePressEdit} onPress={setSelectedWrapper} selected={selected} cliente={item} index={index} />}
                keyExtractor={item=>item.telefono+item.name+item.direccion}
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
    input:{
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
        margin: 20,
        borderRadius: 5,
        textAlign: 'center',
        color: 'black'
    },
    list:{
        height:200,
        margin: 20,
        padding: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5
    }
})

export default EditarClientes