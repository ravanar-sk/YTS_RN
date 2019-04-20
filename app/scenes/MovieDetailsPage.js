
import React, { Component } from 'react';
import {View, SafeAreaView, Image, ScrollView, Text, FlatList, TouchableOpacity} from 'react-native'
import AppColors from '../utils/AppColors.js';
import { createStackNavigator, createAppContainer } from 'react-navigation'

export default class MovieDetails extends Component {

    /**
     * Navigation Options
     */
    static navigationOptions = {
        title:'Details',
        headerStyle: {
            backgroundColor: AppColors.AppColors.ytsHeaderColor
        },
        headerTintColor: AppColors.AppColors.white,
    }

    onMovieTorrentClick(torrentItem) {
        console.log("date uploaded: " + torrentItem.date_uploaded)
      }

    render() {

        var movieData = this.props.navigation.getParam('movieData',{})

        return (
            <SafeAreaView style={{ backgroundColor: AppColors.AppColors.ytsHeaderColor, flex: 1 }}>
                <View style={{ backgroundColor: AppColors.AppColors.ytsBGColor, flex: 1 }}>
                    <Image style={{ position: 'absolute', width: '100%', height: '100%' }} opacity={0.1} resizeMode="repeat" source={require('../assets/images/logo.png')}></Image>
                    <ScrollView>
                        <View>

                            {/* Header Section*/}
                            <View style={{ aspectRatio: 1.5 }}>

                                {/* Background Image and Opacity view */}
                                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: -1, height: -1 }}>
                                    <Image style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, width: -1, height: -1 }} source={{ uri: movieData.background_image_original }} />
                                    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, width: -1, height: -1, backgroundColor: AppColors.AppColors.black }} opacity={0.5} />
                                </View>

                                <View style={{ flexDirection: 'row', flex: 1, padding: 20 }}>
                                    <Image source={{ uri: movieData.large_cover_image }} style={{ flex: 1 }}></Image>
                                    <View style={{ marginLeft: 20, flex: 2, alignItems: 'flex-start' }}>
                                        <Text style={{ color: AppColors.AppColors.white, fontSize: 28, fontWeight: '600' }}> {movieData.title} </Text>
                                        <Text style={{ color: AppColors.AppColors.white, fontSize: 20, fontWeight: '400', marginTop: 10 }}>Rating: {movieData.rating}/10 </Text>
                                        <Text style={{ color: AppColors.AppColors.white, fontSize: 15, fontWeight: '400', marginTop: 10 }}>Genres: {movieData.genres.join(" / ")} </Text>
                                        <Text style={{ color: AppColors.AppColors.white, fontSize: 15, fontWeight: '400', marginTop: 10 }}>Language: {movieData.language} </Text>
                                        <Text style={{ color: AppColors.AppColors.white, fontSize: 15, fontWeight: '400', marginTop: 10 }}>Year: {movieData.year} / Runtime: {movieData.runtime} </Text>
                                    </View>
                                </View>

                            </View>


                            {/* Body Section*/}
                            <View style={{ padding: 20 }}>

                                <Text style={{ flex: 1, marginBottom: 5, color: AppColors.AppColors.white, fontSize: 16 }}>Available Dowloads: </Text>

                                {/* Available torrents list */}
                                <FlatList
                                    data={movieData.torrents}
                                    renderItem={({ item, index }) => (
                                        <MovieAvailabelQualityType torrentData={item} qualityType={item.quality} fileSize={item.size} onClickCallBack={this.onMovieTorrentClick} />
                                    )
                                    }
                                    horizontal={true}
                                >
                                </FlatList>

                                <Text style={{ flex: 1, color: AppColors.AppColors.white, fontSize: 20, marginTop: 10, marginBottom: 5 }}>Synopsis:</Text>
                                <Text style={{ flex: 1, color: AppColors.AppColors.white, fontSize: 18 }}>
                                    {movieData.summary}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    };
}

class MovieAvailabelQualityType extends Component {

    constructor(props) {
        super(props)

        this.onClickHandler = this.onClickHandler.bind(this)
    }

    onClickHandler() {
        this.props.onClickCallBack(this.props.torrentData)
    }

    render() {
        return (
            <TouchableOpacity onPress={this.onClickHandler()}>
                <View style={{ borderWidth: 0.5, borderColor: AppColors.AppColors.white, marginHorizontal: 5 }} borderRadius={5}>
                    <Text style={{ fontSize: 15, color: AppColors.AppColors.white, padding: 5 }}>
                        {this.props.qualityType + " - " + this.props.fileSize}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}
