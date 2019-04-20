import { Component } from 'react'
import { View, StatusBar } from 'react-native'

class SafeAreaAndroid extends Component {
    render() {
        return (
        <View style= {paddingTop = StatusBar.currentHeight}>
        </View>);
    }
}