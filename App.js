import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet,
  Text, 
  View, 
  Image, 
  SafeAreaView, 
  FlatList, 
  TouchableWithoutFeedback, 
  Modal, 
  Alert, 
  Button,
  ActivityIndicator
} from 'react-native';
import moment from 'moment';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import CustomTooltip from './CustomTooltip'

export default function App() {

  const [bills, setBills] = useState([]);
  const [billImageModalVisible, setBillImageModalVisible] = useState(false)
  const [billImageModalUri, setBillImageModalUri] = useState('')
  const [billsListPage, setBillsListPage] = useState(1)
  const [billsLoading, setBillsLoading] = useState(true)
  const [allBillsLoaded, setAllBillsLoaded] = useState(false)

  useEffect(() => {
    
    fetch(`https://my-json-server.typicode.com/A-monem/deferitBackend/page_${billsListPage}`)
      .then(response => {
        setBillsLoading(false)

        if (response.ok){
          return response.json()
        } else {
          setAllBillsLoaded(true)
          return []
        }

      })
      .then(data => {
        setBills(prevState => [...prevState, ...data])
      })
      .catch(error => {
        console.log({error})
      });

  }, [billsListPage])

  const getStatusDotColor = (status) => {
    switch(status) {
      case 'Paid':
        return {
          text: 'Congratulations bill has been paid',
          color: '#4caf50'
        }
        break;
      case 'Unable to pay':
        return {
          text: 'This bill has not been paid yet!!',
          color: '#f44336'
        }
        break;
      case 'Processing':
        return {
          text: 'This bill is currently in processing, it can take approx. 1-2 hours depending on the time of day',
          color: '#ff9800'
        }
        break;
      case 'Scheduled':
        return {
          text: 'This bill is scheduled to be paid and will be paid on the due date, you are in good hands!',
          color: '#3f51b5'
        }
        break;
      default:
        return '#000000'
    }
  }

  const handleImageModal = (uri) => {
    setBillImageModalUri(uri)
    setBillImageModalVisible(true)
  }

  const handleLoadNextBillsListPage = () => {

    if (!billsLoading && !allBillsLoaded){
      setBillsLoading(true)
      setBillsListPage(prevState => prevState + 1)
    }
   
  }

  const renderBillsListItems = ({ item }) => (
    <View style={styles.billItem}>
      <TouchableWithoutFeedback onPress={() => handleImageModal(item.image)}>
        <Image 
          style={styles.billItemImage} 
          source={{ uri: item.image }}
        />
      </TouchableWithoutFeedback>
      <View style={styles.billItemDetails}>
        <View style={styles.billItemDetailsDate}>
          <FontAwesome5 name="calendar" size={wp('5%')} color="black" style={styles.marginHorizontal}/>
          <Text>{ moment(new Date(item.date)).format('LL') }</Text>
        </View>
        <View style={styles.billItemDetailsRow}>
          <View style={styles.billItemDetailsAmountStatus}>
            <FontAwesome5 name="file-invoice-dollar" size={wp('5%')} color="black" style={styles.marginHorizontal}/>
            <Text>${ item.amount }</Text>
          </View>
          <CustomTooltip tooltipText={getStatusDotColor(item.status).text}>
            <View style={styles.billItemDetailsAmountStatus}>
              <Entypo name="dot-single" size={wp('10%')} color={getStatusDotColor(item.status).color} />
              <Text>{ item.status }</Text>
            </View> 
          </CustomTooltip>
        </View>
      </View>
    </View>
  )

  const renderLoadingComponent = () => (

    billsLoading 
    ? 
      <View>
        <ActivityIndicator size="large" />
      </View>
    :
      null
  )

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarText}>My Bills</Text>
      </View>
      <View style={styles.billsList}>
        <SafeAreaView style={styles.billsListSafeAreaView}>
          <FlatList
            data={bills}
            renderItem={renderBillsListItems}
            keyExtractor={item => (item.id * Math.random()).toString()}
            onEndReached={handleLoadNextBillsListPage}
            onEndReachedThreshold={0.7}
            ListFooterComponent={renderLoadingComponent}
          />
        </SafeAreaView>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={billImageModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <Image 
          style={styles.billModalImage} 
          source={{ uri: billImageModalUri }}
        />
        <Button onPress={() => setBillImageModalVisible(false)} title="Close" />
      </Modal>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  marginHorizontal: {
    marginHorizontal: wp('2%')
  },
  appBar: {
    flex: 1,
    backgroundColor: '#3f51b5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBarText: {
    color: '#ffffff', 
    fontWeight: 'bold',
    fontSize: wp('7%'),
    paddingTop: hp('2%'),
  },
  billsList: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('2%')
  },
  billsListSafeAreaView: {
    flex: 1
  }, 
  billItem: {
    marginBottom: hp('1.5%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('1%'),
    backgroundColor: '#ffcf33',
    width: wp('90%'),
    flexDirection: 'row'
  },
  billItemImage: {
    flex: 1,
    height: '100%',
    borderRadius: 5
  },
  billItemDetails: {
    flex: 6,
    paddingHorizontal: wp('4%')
  },
  billItemDetailsDate: {
    flexDirection: 'row',
    paddingBottom: hp('2%'),
    alignItems: 'center'
  },
  billItemDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  billItemDetailsAmountStatus: {
    flexDirection: 'row',
    alignItems: 'center'
  }, 
  billModalImage: {
    flex:1,
    marginHorizontal: wp('2%'),
    marginVertical: hp('2%')
  }
});