import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import Icons from 'react-native-vector-icons/Feather'

import colors from '../utils/colors'

function ListItemBuscarProductos(props){

    let text_to_show = props.producto
    if(props.producto.length >= 30){
        text_to_show = text_to_show.substr(0,30) + '...'
    }

    return(
        <Pressable onPress={()=>{props.onPress(props.producto)}} style={props.index%2?styles.item:styles.item_painted}>
            <Text style={styles.item_text}>{text_to_show} {props.cantidad? ` x ${props.cantidad}` : false}</Text> 
            {
                props.cantidad? 
                    <Pressable onPress={()=>{props.onPressMinus(props.producto)}}>
                        <Icons name='minus-square' size={27} color='red' />
                    </Pressable> 
                : false
            }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    item_painted:{
        backgroundColor: colors.list,
        margin: 3,
        padding: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20
    },
    item:{
        margin: 3,
        padding: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20
    },
    item_text:{
        fontWeight: 'bold',
        margin: 5
    }
})

export default ListItemBuscarProductos