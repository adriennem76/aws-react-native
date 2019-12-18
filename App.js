import React from 'react';
import Amplify from 'aws-amplify'
import config from './aws-exports'
Amplify.configure(config)
import { SafeAreaView, StyleSheet, Text, View, TextInput, Button} from 'react-native';

import { withAuthenticator } from 'aws-amplify-react-native'
import { Auth, API, graphqlOperation  } from 'aws-amplify'

import { listRestaurants } from './src/graphql/queries'
import { createRestaurant } from './src/graphql/mutations'

import uuid from 'uuid/v4'
const CLIENTID = uuid()

class App extends React.Component {
  state = {
    coins: []
  }
  async componentDidMount() {
    try {
      // to get all coins, do not send in a query parameter
      // const data = await API.get('cryptoapi', '/coins')
      const data = await API.get('cryptoapi', '/coins?limit=5&start=100')
      console.log('data from Lambda REST API: ', data)
      this.setState({ coins: data.coins })
    } catch (err) {
      console.log('error fetching data..', err)
    }
  }
  
  // signOut = () => {
  //   Auth.signOut()
  //     .then(() => this.props.onStateChange('signedOut'))
  //     .catch(err => console.log('err: ', err))
  // }
  render() {
    return (
      <View>
        {
          this.state.coins.map((c, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.name}>{c.name}</Text>
              <Text>{c.price_usd}</Text>
            </View>
          ))
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: { padding: 10 },
  name: { fontSize: 20, marginBottom: 4 },
})

export default withAuthenticator(App, {
  includeGreetings: true
})