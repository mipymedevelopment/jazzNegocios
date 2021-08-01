import React from 'react'
import {Pressable, View, Text, StyleSheet,Dimensions} from 'react-native'

import colors from '../utils/colors'

const screenWith = Dimensions.get('screen').width

function BigButton(props){
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
        borderWidth:1,
        borderColor: colors.text,
        height: 70,
        display: 'flex',
        justifyContent: 'center',
        width: screenWith
    },
    text:{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: colors.text
    }
})

export default BigButton