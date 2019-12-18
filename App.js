import React from 'react';
import Amplify from 'aws-amplify'
import config from './aws-exports'
Amplify.configure(config)
import { SafeAreaView, StyleSheet, Text, View, TextInput, Button} from 'react-native';

import { withAuthenticator } from 'aws-amplify-react-native'
import { Auth, API, graphqlOperation, Analytics, Storage } from 'aws-amplify'

import { listRestaurants } from './src/graphql/queries'
import { createRestaurant } from './src/graphql/mutations'

import uuid from 'uuid/v4'
const CLIENTID = uuid()

class App extends React.Component {
  
  state = {username: ''}
  
  async componentDidMount() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      this.setState({ username: user.username })
    } catch (err) {
      console.log('error getting user: ', err)
    }
  }
  recordEvent = () => {
    Analytics.record({
      name: 'My test event',
      attributes: {
        username: this.state.username
      }
    })
  }
  addToStorage = () => {
    Storage.put('textfiles/mytext.txt', `Hello World`)
      .then (result => {
        console.log('result: ', result)
      })
      .catch(err => console.log('error: ', err));
  }

  readFromStorage = () => {
    Storage.list('')
      .then(data => console.log('data from S3: ', data))
      .catch(err => console.log('error fetching from S3', err))
  }
  
  // signOut = () => {
  //   Auth.signOut()
  //     .then(() => this.props.onStateChange('signedOut'))
  //     .catch(err => console.log('err: ', err))
  // }
  render() {
    return (
      <View>
        
      <Button onPress={this.recordEvent} title='Record Event' />
      <Button onPress={this.addToStorage} title='Add to Storage' />
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