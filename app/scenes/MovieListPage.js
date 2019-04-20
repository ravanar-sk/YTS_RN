import React, { Component } from 'react';
import { View, Text, SafeAreaView, Image, Dimensions, Alert } from 'react-native'
import { FlatList, TouchableOpacity, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import AppColors from '../utils/AppColors.js';
import DeviceInfo from 'react-native-device-info';
import NonDeterministicProgressBar from '../components/RavProgressBar.js'
import {getMovies} from '../network_layer/NetworkLayer.js'

export default class MovieList extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerStyle: {
                backgroundColor: AppColors.AppColors.ytsHeaderColor
            },
            headerTintColor: AppColors.AppColors.white,
            headerLeft: (<View>
                <TouchableOpacity onPress={navigation.getParam('searchPage')}>
                    <View style={{ flexDirection: 'row', alignItems:'center' }}>
                        <Image style={{ width: 20, aspectRatio: 1, marginLeft: 20, resizeMode:'contain'}} source={require("../assets/images/searchIcon/searchIcon.png")} />
                        <Text style={{ marginLeft: 10, fontSize: 22, fontWeight: '400', color: AppColors.AppColors.white }}>Movie List</Text>
                    </View>
                </TouchableOpacity>
            </View>)
        }
    };

    /** 
     *  Constructor
     */
    constructor(props) {
        super(props);

        this.state = {
            arrayMovie: [],
            page: 1,
            numberOfColumns:((DeviceInfo.isTablet())?(DeviceInfo.isLandscape()?6:4):(DeviceInfo.isLandscape()?5:3)),
            reloadMovieFlatList:true,
            progressBarAnimate:false,
            progressBarHidden:true,
            isAPILoading: false
        }

        this.onMovieClicked = this.onMovieClicked.bind(this)
        this.listRenderItem = this.listRenderItem.bind(this)
        this.screenSizeChanged = this.screenSizeChanged.bind(this);
        this.getMovies = this.getMovies.bind(this)
        this.listOnEndReached = this.listOnEndReached.bind(this)
    }

    /**
     * Navigation Life Cycle
     */
    componentDidMount() {
        this.props.navigation.setParams({searchPage: this._onSearchPageClicked});

        Dimensions.addEventListener("change",this.screenSizeChanged);


        this.getMovies()
    }

    componentWillUnmount() {
        Dimensions.removeEventListener("change",this.screenSizeChanged);
    }

    /**
     * Device screen size change observers
     */
    screenSizeChanged(obj) {
        this.setState({
            numberOfColumns:((DeviceInfo.isTablet())?(DeviceInfo.isLandscape()?6:4):(DeviceInfo.isLandscape()?5:3)),
            reloadMovieFlatList: !this.state.reloadMovieFlatList
        });
    }

    // reload flatList
    reloadFlatList() {
        this.setState({
            reloadMovieFlatList: !this.state.reloadMovieFlatList
        });
    }

    // API Function
    getMovies() {

        if (this.state.isAPILoading == false) {

            param = {
                limit: 50,
                page: (this.state.arrayMovie.length / 50) + 1,
                sort_by:"year",
                order_by:"desc"
            }

            this.setState({
                progressBarAnimate: true,
                progressBarHidden: false,
                isAPILoading:true
            })
            getMovies(param, (response) => {

                if (response['status'] == 'ok') {
                    var data = response['data']
                    var responseMovies = data['movies']

                    if (responseMovies.length>0) {

                        var oldMoviesArray = this.state.arrayMovie
                        var newMovies = oldMoviesArray.concat(responseMovies)

                        this.setState({
                            arrayMovie:newMovies
                        })

                        this.reloadFlatList();

                    }

                } else {
                    Alert.alert('Error',response['status_message'])
                }

                this.setState({
                    progressBarAnimate: false,
                    progressBarHidden: true,
                    isAPILoading:false
                })
            }, (error) => {

                Alert.alert('Error',error)

                this.setState({
                    progressBarAnimate: false,
                    progressBarHidden: true,
                    isAPILoading:false
                })
            })
        }
    }

    /**
     * Header Search Button click
     */
    _onSearchPageClicked = () => {
        this.props.navigation.navigate('MovieSearchPage')
    }

    /**
     * Movie List item click
     */
    onMovieClicked(movieData) {
        this.props.navigation.navigate('MovieDetailsScreen', { movieData: movieData })
    }

    /**
     * Flat List on end reached
     */

     listOnEndReached = (infoObject) => {
         this.getMovies()
     }

    /**
     * Movie List render function
     */
    listRenderItem = (item) => (
        <MovieItem numberOfColumns={ this.state.numberOfColumns } movieData={item.item} onClicked={this.onMovieClicked} />
    )

    // key={this.state.reloadMovieFlatList}

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: AppColors.AppColors.ytsBGColor }}>
                <Image source={require('../assets/images/logo.png')} style={{ position: 'absolute', width: '100%', height: '100%' }} opacity={0.1} resizeMode='repeat'></Image>
                <SafeAreaView style={{ flex: 1 }}>
                    <NonDeterministicProgressBar hidden={this.state.progressBarHidden} animate={this.state.progressBarAnimate} />
                    <FlatList
                        key={this.state.numberOfColumns}
                        style={{ flex: 1 }}
                        extraData={this.state.reloadMovieFlatList}
                        data={this.state.arrayMovie}
                        renderItem={this.listRenderItem}
                        numColumns={this.state.numberOfColumns}
                        horizontal={false}
                        onEndReachedThreshold={0.25}
                        onEndReached={this.listOnEndReached}
                        keyExtractor={(item, index) => item.id}>
                    </FlatList>
                </SafeAreaView>
            </View>
        );
    }
}

/**
 * Movie Flat List Render Item
 */
class MovieItem extends Component {

    constructor(props) {
        super(props)

        this.onTouchHandler = this.onTouchHandler.bind(this)
        this.getItemWidth = this.getItemWidth.bind(this)
        this.calculateColunWidth = this.calculateColunWidth.bind(this)
    }

    onTouchHandler() {
        this.props.onClicked(this.props.movieData)
    }

    getItemWidth() {
        columns = this.props.numberOfColumns
        return this.calculateColunWidth(columns)
    }

    getFlexForItem() {
        return (1/this.props.numberOfColumns)
    }

    calculateColunWidth(columns) {

        width = ( (DeviceInfo.isTablet()) ? (Dimensions.get('window').height/ columns) : (Dimensions.get('window').width / columns) )
        return width
    }

    render() {
        return (
            <View style={{ flex:this.getFlexForItem() , width:this.getItemWidth() }}>
                <TouchableOpacity style={{ flex:1 }} onPress={this.onTouchHandler}>
                    <View style={{ flex:1, aspectRatio: 0.7 }}>
                        <View style={{ margin: 3, flex: 1 }}>
                            <Image
                                style={{ flex: 1 }}
                                defaultSource={require('../assets/images/moviePlaceholder/moviePlaceholder.png')}
                                source={{ uri: this.props.movieData["medium_cover_image"], cache: 'force-cache' }}
                                resizeMode='cover' />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

/**
 * Navigation Bar headerLeft Item
 */
class SearchButton extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View>
        <TouchableOpacity>
            <Image source={require('../assets/images/searchIcon/searchIcon.png')}/>
        </TouchableOpacity>
        </View>
        );
    }
}

