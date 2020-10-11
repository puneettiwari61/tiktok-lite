import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import Video from 'react-native-video';
import Axios from 'axios';
const {width, height} = Dimensions.get('window');

const url = 'https://europe-west1-boom-dev-7ad08.cloudfunctions.net/videoFeed';

const dataProvider = new DataProvider((r1, r2) => {
  // console.log(r1,r2,"from dataprovider")
  return r1 !== r2;
});

const TikTok = () => {
  const [data, setData] = useState({
    dataProvider: dataProvider.cloneWithRows([
      'https://stream.mux.com/bCaQdAF1wKTzEFgcIVMWIC36nfEDl4cIbvwkMZPKvaE.m3u8',
    ]),
    urls: [],
    page: 0,
  });

  useEffect(() => {
    fetchMoreVideos();
  }, []);

  const fetchMoreVideos = async () => {
    const videosArray = await Axios.post(url, {page: data.page});
    let urls = videosArray.data.map((d) => d.playbackUrl);
    // console.log(urls, this.state.page, 'from fetc');
    urls = data.urls.concat(urls);
    setData({
      urls: urls,
      dataProvider: dataProvider.cloneWithRows(urls),
      page: data.page + 1,
    });
  };

  const layoutProvider = new LayoutProvider(
    (index) => {
      return 0;
    },
    (type, dim) => {
      dim.width = width;
      dim.height = height;
    },
  );

  const rowRenderer = (type, link) => {
    // console.log(type, link, 'from _rowRenderer');
    return (
      <Video
        source={{
          uri: link,
        }}
        repeat={true}
        style={styles.backgroundVideo}
        fullscreen
        resizeMode={'cover'}
        onEnd={() => console.log('hey video ended')}
      />
    );
  };

  return (
    <RecyclerListView
      layoutProvider={layoutProvider}
      dataProvider={data.dataProvider}
      rowRenderer={rowRenderer}
      onEndReached={() => fetchMoreVideos()}
      onEndReachedThreshold={500}
      // renderFooter={()=><Text>Loading...</Text>}
    />
  );
};

export default TikTok;

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
