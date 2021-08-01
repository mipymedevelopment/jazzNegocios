import React from 'react'
import {Pressable, View, Text, StyleSheet} from 'react-native'

import colors from '../utils/colors'

function SimpleButton(props){
    return(
        <View style={props.style}>
            <Pressable onPress={props.onPress} style={styles.button}>
                <Text style={styles.text}>{props.text}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    button:{
        backgroundColor: colors.orange,
        padding: 10,
        borderRadius: 5,
        borderStyle: 'solid',
        borderWidth:1
    },
    text:{
        textAlign: 'center',
        fontWeight: 'bold'
    }
})

export default SimpleButton