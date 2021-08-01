import React, {useState, useEffect, useContext} from 'react'
import {ScrollView, View, Text, TextInput, StyleSheet} from 'react-native'
import Icons from 'react-native-vector-icons/Entypo'
import AsyncStorage from '@react-native-async-storage/async-storage'

import SimpleButton from '../components/SimpleButton'
import colors from '../utils/colors'
import MyContext from '../utils/MyContext'

function Login(props){

    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const {apiUrl} = useContext(MyContext)

    const isLogged = async () =>{
        let jwt = await AsyncStorage.getItem('jwt')
        let response = await fetch(`${apiUrl}/isauth`,{
            headers: {'Authorization': 'Bearer ' + jwt}
        })
        if(response.status === 401){
            console.log('no auth')
        }else{
            response = await response.json()
            props.navigation.navigate('Main')
        }
    }

    const handlePressLogin = async () =>{
        let response = await fetch(`${apiUrl}/login?user=${user}&password=${pass}`)
        response = await response.json()
        if(response.status){
            console.log('loggeado')
            await AsyncStorage.setItem('jwt', response.token)
            isLogged()
        }else{
            console.log('error logeando')
        }
    }

    useEffect(()=>{
        isLogged()
    },[])

    return(
        <ScrollView style={styles.container}>
            <View style={styles.titleContainer}>
                <Icons name='paper-plane' size={70} color='black' />
                <Text style={styles.title}>JazzDelivery</Text>
            </View>
            <TextInput style={styles.input} placeholder='Usuario' defaultValue={user} onChangeText={t=>{setUser(t)}} />
            <TextInput style={styles.input} placeholder='Contraseña' defaultValue={pass} onChangeText={t=>{setPass(t)}}/>
            <SimpleButton style={styles.button} text='Login' onPress={handlePressLogin} /> 
            <Text>
                
            </Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.blue
    }
    ,
    button:{
        margin: 10
    },
    input:{
        backgroundColor: 'white',
        borderRadius:5,
        borderWidth: 1,
        borderStyle: 'solid',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
        textAlign: 'center'
    },
    titleContainer:{
        margin: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    title:{
        fontWeight: 'bold',
        fontSize: 30
    }
})

export default Login