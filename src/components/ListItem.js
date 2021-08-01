import React, {useState} from 'react'
import { Pressable, Text, View, StyleSheet } from 'react-native'

import colors from '../utils/colors'

function ListItem(props){

    const selected_style = props.index%2 ? styles.item: styles.item_painted

    const handlePressItem = () =>{
        props.onPress(props.index)
    }

    return(
        <Pressable onPress={handlePressItem} style={props.selected==props.index?styles.item_selected:selected_style}>
            <Text style={styles.text}>{props.producto}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    item:{
        padding: 5,
        borderRadius: 5
    },
    item_painted:{
        padding: 5,
        backgroundColor: colors.list,
        borderRadius: 5
    },
    item_selected:{
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5
    },
    text:{
        fontWeight: 'bold',
        padding: 5
    }
})

export default ListItem