import {Image,StyleSheet} from 'react-native';
import React, {Component} from 'react';
import Carousel from 'react-native-snap-carousel';

export default class Carrousel extends Component {

  constructor(props) {
        super(props);
  }

 componentDidMount()
 {
  if(this.props.onChange!=null)  
   this.props.onChange(this._carousel.currentIndex)
 }

  componentDidUpdate(prevProps) {
    if(prevProps.images !== this.props.images) {
        if(this.props.onChange!=null)
        this.props.onChange(this._carousel.currentIndex)
    }
  }

  changeToPage(index) {
    if(this.props.onChange!=null)
   this.props.onChange(index)
  }
 
  _renderItem ({item, index}) {
    return (
        <Image source={{uri:item.uri}} style={styles.addImage}/>
    );
}

  render() {
    const {images} = this.props
      

   return (
    <Carousel
      style={styles.container}
      ref={(c) => { this._carousel = c; }}
      data={images}
      renderItem={this._renderItem}
      sliderWidth={1000}
      itemWidth={180}
      autoplay={true}
      onSnapToItem={(index)=>this.changeToPage(index)}
     
    />
   );

  }
}


var styles = StyleSheet.create({

    addImage:{
        width:180,
        height:180,
        borderRadius:4,
    },
   
  });

  