
import React ,{ Component } from 'react'
import { Animated, Easing, View, Dimensions } from 'react-native'
import AppColors from '../utils/AppColors.js';

/**
 * Loader
 */

class NonDeterministicProgressBar extends Component {

    /**
     * PROPERTIES:
     * 
     * trackColor // The Track color, format: '#rrggbb'
     * indicatorColor // The Indicator color, format: '#rrggbb'
     * duration // Duration for one cycle, format: number(miliseconds)
     * animate // start/stop animating format: boolean
     * hidden // format: boolean
     */

     defaultTrackColor = '#FECBCE'
     defaultIndicatorColor = '#840007'
     defaultDuration = 3000
     defaultAnimate = true

    constructor(props) {
        super(props)

        this.state = {
            trackColor: (this.props.trackColor == null ? this.defaultTrackColor : this.props.trackColor),
            indicatorColor: (this.props.indicatorColor == null ? this.defaultIndicatorColor : this.props.indicatorColor)
        }

        // Timing initial calculations
        this.totalTime = (this.props.duration != null ? this.props.duration : this.defaultDuration)
        this.timeFirstPhaseRatio = 0.5
        this.timeSecondPhaseRatio = 0.4

        this.timeFirstPhase = this.totalTime * this.timeFirstPhaseRatio
        this.timeSecondPhase = this.totalTime * this.timeSecondPhaseRatio

        // Intiating animate values
        this.viewXPositionAnimatedValue = new Animated.Value(0)
        this.viewWidthAnimatedValue = new Animated.Value(0)

        this.loadDefaults()

    }

    loadDefaults() {
        this.viewXPositionInterpolator = this.viewXPositionAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Dimensions.get('window').width]
        })

        this.viewWidthInterpolator = this.viewWidthAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Dimensions.get('window').width]
        })

        this.minWidthRatio = 0.2
        this.maxWidthRatio = 0.6
        this.totalWidth = Dimensions.get('window').width

        this.minimumWidth = this.totalWidth * this.minWidthRatio
        this.maximumWidth = this.totalWidth * this.maxWidthRatio
    }

    /**
     * Navigation Life Cycle
     */
    componentDidMount() {
        Dimensions.addEventListener("change",this.screenSizeChanged);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener("change",this.screenSizeChanged);
    }

    /**
     * Device screen size change observers
     */
    screenSizeChanged(obj) {
        // this.loadDefaults()
    }


    convertValueForRange(oldValue, lowRange1, highRange1, lowRange2, highRange2) {
        return (((oldValue - lowRange1) * (highRange2 - lowRange2)) / (highRange1 - lowRange1)) + lowRange2
    }


    animationPhase1_PartA() {

        this.viewWidthAnimatedValue.setValue(0)
        this.viewXPositionAnimatedValue.setValue(0)

        widthFirstValue = this.convertValueForRange(this.minimumWidth, 0, this.totalWidth, 0, 1)
        this.anim1 = Animated.timing(this.viewWidthAnimatedValue, {
            toValue: widthFirstValue,
            easing: Easing.linear,
            duration: (this.timeFirstPhase * this.minWidthRatio),
            delay: 0
        });

        this.anim1.start((obj) => {
            if (obj.finished == true) {
                this.animationPhase1_PartB()
            }
        })

    }

    animationPhase1_PartB() {

        widthSecondValue = this.convertValueForRange(this.maximumWidth, 0, this.totalWidth, 0, 1)

        this.anim2 = Animated.timing(this.viewWidthAnimatedValue, {
            toValue: widthSecondValue,
            easing: Easing.linear,
            duration: (this.timeFirstPhase * (1 - this.minWidthRatio))
        })

        this.anim3 = Animated.timing(this.viewXPositionAnimatedValue, {
            toValue: 1.0,
            easing: Easing.linear,
            duration: (this.timeFirstPhase * (1 - this.minWidthRatio))
        })

        Animated.parallel([this.anim2, this.anim3]).start((status) => {

            if (status.finished == true) {
                this.animationPhase2_PartA()
            }
        })

    }

    animationPhase2_PartA() {

        this.viewXPositionAnimatedValue.setValue(0)
        this.viewWidthAnimatedValue.setValue(0)

        widthSecondValue = this.convertValueForRange(this.maximumWidth, 0, this.totalWidth, 0, 1)

        this.anim4 = Animated.timing(this.viewWidthAnimatedValue, {
            toValue: widthSecondValue,
            easing: Easing.linear,
            duration: (this.timeSecondPhase * this.maxWidthRatio)
        })

        this.anim4.start((obj) => {
            if (obj.finished == true) {
                this.animationPhase2_PartB()
            }
        })

    }

    animationPhase2_PartB() {

        widthFirstValue = this.convertValueForRange(this.minimumWidth, 0, this.totalWidth, 0, 1)

        this.anim5 = Animated.timing(this.viewXPositionAnimatedValue, {
            toValue: 1,
            easing: Easing.linear,
            duration: (this.timeSecondPhase * (1 - this.maxWidthRatio))
        })

        this.anim6 = Animated.timing(this.viewWidthAnimatedValue, {
            toValue: widthFirstValue,
            easing: Easing.linear,
            duration: (this.timeSecondPhase * (1 - this.maxWidthRatio))
        })

        Animated.parallel([this.anim5, this.anim6]).start((status) => {
            if (status.finished == true) {
                console.log('ANIMATION RESET')
                this.animationPhase1_PartA()
            }
        })
    }

    startAnimation() {
        this.animationPhase1_PartA()
    }

    stopAnimation() {

        if (this.anim1 != null) {
            this.anim1.stop()
        }

        if (this.anim2 != null) {
            this.anim2.stop()
        }

        if (this.anim3 != null) {
            this.anim3.stop()
        }

        if (this.anim4 != null) {
            this.anim4.stop()
        }

        if (this.anim5 != null) {
            this.anim5.stop()
        }

        if (this.anim6 != null) {
            this.anim6.stop()
        }

    }

    render() {

        if (this.props.animate == true) {
            this.startAnimation();
        } else {
            this.stopAnimation()
        }

        if (this.props.hidden == true) {
            return null
        } 

        return (
            <View style={{ width: '100%', height: 3, overflow:'hidden', backgroundColor:this.state.trackColor }}>
                <Animated.View style={{ width: this.viewWidthInterpolator, height: '100%', backgroundColor: this.state.indicatorColor, transform: [{ translateX: this.viewXPositionInterpolator }] }} />
            </View>
        );
    }

    
}


export { NonDeterministicProgressBar as default  };