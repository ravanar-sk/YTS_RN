import React, { Component } from 'react'
import { FlatList, Image, Text, View, Dimensions, Alert } from 'react-native'
import { SafeAreaView } from 'react-navigation';
import AppColors from '../utils/AppColors';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

import { getMovies } from '../network_layer/NetworkLayer.js'
import NonDeterministicProgressBar from '../components/RavProgressBar.js'

import DeviceInfo from 'react-native-device-info';

export default class MovieSearch extends Component {

    constructor(props) {
        super(props)

        this.state = {
            arrayMovies: [],
            reloadMovieFlatList: true,
            numberOfColumns: (DeviceInfo.isTablet() ? (DeviceInfo.isLandscape() ? 4 : 3) : (DeviceInfo.isLandscape() ? 2 : 1)),
            apiID: 0,
            progressBarAnimate: false,
            progressBarHidden: true,
        }

        this.screenSizeChanged = this.screenSizeChanged.bind(this)
        this.movieListRenderItem = this.movieListRenderItem.bind(this)
        this.reloadSearchMoviesList = this.reloadSearchMoviesList.bind(this)
        this._movieSearchListColumn = this._movieSearchListColumn.bind(this)
        this.onSearchTextChanged = this.onSearchTextChanged.bind(this)
        this.getMoviesFromURL = this.getMoviesFromURL.bind(this)
        this.getMoviesWithKeyowrd = this.getMoviesWithKeyowrd.bind(this)
        this._onMovieClicked = this._onMovieClicked.bind(this)
    }

    /**
     * Navigation Options
     */
    static navigationOptions = {
        title: "Movie Search",
        headerStyle: {
            backgroundColor: AppColors.AppColors.ytsHeaderColor
        },
        headerTintColor: AppColors.AppColors.white
    }

    /**
     * Navigation Life Cycle
     */
    componentDidMount() {
        Dimensions.addEventListener("change", this.screenSizeChanged);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener("change", this.screenSizeChanged);
    }

    /**
     * Device screen size change observers
     */
    screenSizeChanged(obj) {

        this.setState({
            numberOfColumns: (DeviceInfo.isTablet() ? (DeviceInfo.isLandscape() ? 4 : 3) : (DeviceInfo.isLandscape() ? 2 : 1)),
            reloadMovieFlatList: !this.state.reloadMovieFlatList
        });



    }

    // API Function
    getMoviesFromURL(searchQuery) {
        this.getMoviesWithKeyowrd(searchQuery, this.state.apiID + 1)
    }

    getMoviesWithKeyowrd(keyword, apiId) {

        this.setState({
            apiID: apiId
        })

        if ((this.state.progressBarAnimate == false) && (this.state.progressBarHidden == true)) {
            this.setState({
                progressBarAnimate: true,
                progressBarHidden: false
            })
        }

        param = {
            query_term: keyword,
            limit: 50,
            page: 1,
            sort_by: "year",
            order_by: "desc"
        }

        getMovies(param, (response) => {

            if (this.state.apiID == apiId) {

                if (response['status'] == 'ok') {
                    var data = response['data']
                    var movieCount = data['movie_count']
                    var responseMovies = data['movies']

                    this.setState({
                        arrayMovies: (movieCount > 0 ? responseMovies : [])
                    })
                    this.reloadSearchMoviesList();

                } else {
                    Alert.alert('Error', response['status_message'])
                }

                this.setState({
                    progressBarAnimate: false,
                    progressBarHidden: true,
                })
            }

        }, (error) => {

            Alert.alert('Error', error)

            if (this.state.apiID == apiId) {
                this.setState({
                    progressBarAnimate: false,
                    progressBarHidden: true,
                })
            }
        })
    }

    /**
     * Text change handler
     */
    onSearchTextChanged(searchQuery) {
        this.getMoviesFromURL(searchQuery)
    }

    /**
     *  Reload Flatlist
     */
    reloadSearchMoviesList() {
        this.setState({
            reloadMovieFlatList: !this.state.reloadMovieFlatList
        })
    }

    /**
     * Movie Click
     */
    _onMovieClicked(movieData) {
        this.props.navigation.navigate('MovieDetailsScreen', { movieData: movieData })
    }

    /**
     * FLatList render item method
     */
    movieListRenderItem = (item) => (
        <SearchMovieItem numberOfColumns={this.state.numberOfColumns} movieData={item.item} onClicked={this._onMovieClicked} />
    )

    /**
     * Number of colums based on device and orientation
     */
    _movieSearchListColumn = () => {
        if (DeviceInfo.isTablet()) {
            return DeviceInfo.isLandscape() ? 4 : 3;
        } else {
            return DeviceInfo.isLandscape() ? 2 : 1;
        }
    }

    render() {
        return (

            <SafeAreaView>
                <View style={{ backgroundColor: AppColors.AppColors.ytsHeaderColor }}>
                    <Image style={{ position: 'absolute', width: '100%', height: '100%' }} opacity={0.1} resizeMode="repeat" source={require('../assets/images/logo.png')}></Image>
                    <View style={{ height: '100%', backgroundColor: AppColors.AppColors.transparent }}>

                        <NonDeterministicProgressBar hidden={this.state.progressBarHidden} animate={this.state.progressBarAnimate} />

                        <View>
                            <View style={{ height: 50, width: "90%", flexDirection: "row", alignSelf: "center" }}>
                                <TextInput
                                    style={{ flex: 1, color: AppColors.AppColors.white, fontSize: 16 }}
                                    numberOfLines={1}
                                    placeholder="Enter Text"
                                    placeholderTextColor={AppColors.AppColors.gray}
                                    onChangeText={this.onSearchTextChanged} />
                                <TouchableOpacity>
                                    <View style={{ height: "100%", aspectRatio: 1, padding: 10 }}>
                                        <Image style={{ height: "100%", width: "100%" }} source={require("../assets/images/searchIcon/searchIcon.png")} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: "80%", height: 1, alignSelf: "center", backgroundColor: AppColors.AppColors.white }} opacity={0.15} />
                        </View>
                        <FlatList
                            key={this.state.numberOfColumns}
                            style={{ flex: 1 }}
                            extraData={this.state.reloadMovieFlatList}
                            numColumns={this.state.numberOfColumns}
                            data={this.state.arrayMovies}
                            renderItem={this.movieListRenderItem}
                            keyExtractor={(item, index) => item.id} />
                    </View>
                </View>
            </SafeAreaView >
        );
    }
}

class SearchMovieItem extends Component {

    constructor(props) {
        super(props)

        this._flexForItem = this._flexForItem.bind(this)
        this.onItemClickHandler = this.onItemClickHandler.bind(this)
    }

    _flexForItem() {
        return (1 / this.props.numberOfColumns)
    }

    onItemClickHandler() {
         this.props.onClicked(this.props.movieData)
    }

    render() {
        return (
            <TouchableOpacity onPress={this.onItemClickHandler}>
                <View style={{ flex: this._flexForItem(), flexDirection: 'row', padding: 10 }} >

                    <Image
                        style={{ flex: 1, aspectRatio: 0.7, resizeMode: 'cover' }}
                        defaultSource={require('../assets/images/moviePlaceholder/moviePlaceholder.png')}
                        source={{ uri: this.props.movieData["medium_cover_image"], cache: 'force-cache' }} />
                    <View style={{ flex: 3, marginLeft: 10 }}>
                        <Text style={{ color: AppColors.AppColors.white, fontSize: 20, fontWeight: '500' }} >{this.props.movieData.title} ({this.props.movieData.year})</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: AppColors.AppColors.white, fontSize: 14, fontWeight: '300' }}>{this.props.movieData.rating}</Text>
                            <Text style={{ color: AppColors.AppColors.white, fontSize: 17, fontWeight: '300' }}> / </Text>
                            <Text style={{ color: AppColors.AppColors.white, fontSize: 14, fontWeight: '300' }}>{this.props.movieData.runtime}</Text>
                        </View>
                        <Text style={{ color: AppColors.AppColors.white, fontSize: 14, fontWeight: '300' }}>{this.props.movieData.genres.join("/")}</Text>
                        <Text style={{ color: AppColors.AppColors.white, fontSize: 14, fontWeight: '300' }}>{this.props.movieData.language}</Text>
                        <Text style={{ color: AppColors.AppColors.white, fontSize: 16, fontWeight: '600' }}>Quality Images</Text>
                    </View>

                </View>
            </TouchableOpacity>
        );
    }
}