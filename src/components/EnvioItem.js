import React from 'react'
import { Pressable, View,Text, StyleSheet } from 'react-native'
import IconsComunity from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import colors from '../utils/colors'

function EnvioItem(props){

    const SelectIcon = () =>{
        if(props.envio.state == 'waiting'){
            return <IconsComunity name='timer-sand' size={40} color='black'  style={styles.icon} />
        }else if(props.envio.state == 'encurso'){
            return <IconsComunity name='motorbike' size={40} color='black'  style={styles.icon} />
        }else if(props.envio.state == 'entregado'){
            return <Ionicons name='ios-happy-outline' size={40} color='black' style={styles.icon} />
        }
    }

    const selectColor = () =>{
        if(props.envio.state == 'waiting'){
            return colors.green
        }else if(props.envio.state == 'encurso'){
            return colors.greenDark
        }else if(props.envio.state == 'entregado'){
            return colors.orangeDark
        }
    }

    return(
        <Pressable onPress={()=>{props.onPress(props.envio._id)}} style={[styles.container,{backgroundColor: selectColor()}]}>
            <View style={styles.info}>
                <Text style={styles.address}>{props.envio.address}</Text>
                <Text>{props.envio.items}</Text>
            </View>
            <SelectIcon />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container:{
        marginTop: 20,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    address:{
        fontWeight: 'bold',
    },
    info:{
        marginLeft: 20,
        maxWidth: '70%'
    },
    icon:{
        marginRight: 20
    }
})

export default EnvioItem