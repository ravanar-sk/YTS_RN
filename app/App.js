/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import MovieList from './scenes/MovieListPage.js';
import MovieDetails from './scenes/MovieDetailsPage.js';
import MovieSearch from './scenes/MovieSearchPage.js';


type Props = {};
export default class App extends Component<Props> {

  render() {

    return (
      <AppNavigationContainer></AppNavigationContainer>
    );
  }
}








const navigationStack = createStackNavigator({
  MovieListScreen: { screen: MovieList },
  MovieDetailsScreen: { screen: MovieDetails },
  MovieSearchPage: { screen: MovieSearch }
}, {
    initialRouteName: "MovieListScreen"
  });

const AppNavigationContainer = createAppContainer(navigationStack);

