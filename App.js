import React from 'react';
import dva, { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { createMemoryHistory as createHistory } from 'history';
import { View, Text, TouchableOpacity } from 'react-native';
import { Router, Route } from 'dva/router';
import Stack from 'react-router-native-stack';

const app = dva({
  history: createHistory(),  // Trick !!
  initialState: {}
});

app.model({
  namespace: 'user',
  state: {},
  reducers: {},
  effects: {
    *login ( action, { put } ) {
      yield put(routerRedux.push({ pathname: '/home' }));
    }
  },
  subscriptions: {
    // You can use history object in subscriptions.
    setup({ history, dispatch }) {
      history.listen(({ pathname }) => {
        if (pathname === '/home') { alert('logged in'); }
      });
    }
  }
});

const LoginPage = connect()(({ dispatch }) => {
  const onPress = () => { dispatch({ type: 'user/login'}) };
  return (
    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={onPress}>
        <Text style={{ fontSize: 24 }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
});

const HomePage = () => {
  return (
    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24 }}>Welcome</Text>
    </View>
  );
};

app.router(({ history }) => (
  <Router history={history}>
    <Stack>
      <Route path="/" exact component={LoginPage} />
      <Route path="/home" exact component={HomePage} />
    </Stack>
  </Router>
));

const App = app.start();

export default App;
