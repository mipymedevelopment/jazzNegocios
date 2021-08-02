import React,{useState, useEffect} from 'react'
import { Pressable, Text, View, StyleSheet } from 'react-native'
import Icons from 'react-native-vector-icons/Feather'

import colors from '../utils/colors'

function ListItem(props){

    const selected_style = props.index%2 ? styles.item: styles.item_painted
    const [text, setText] = useState('')


    const handlePressItem = () =>{
        props.onPress(props.index)
    }

    useEffect(()=>{
        let text_ = `${props.cliente.name} - ${props.cliente.direccion}`
        if(text_.length > 40){
            text_ = text_.substr(0,40) + '...'
        }
        setText(text_)
    },[])

    return(
        <Pressable onPress={handlePressItem} style={props.selected==props.index?styles.item_selected:selected_style}>
            <Text style={styles.text}>{text}</Text>
            {
                props.selected===props.index? 
                    <Pressable onPress={()=>{props.onEdit(props.cliente)}} >
                        <Icons name='edit' size={25} color='black' />
                    </Pressable>                    
                : false
            }
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
        backgroundColor: 'green',
        padding: 5,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20
    },
    text:{
        fontWeight: 'bold',
        padding: 5
    }
})

export default ListItem