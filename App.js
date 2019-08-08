import React from 'react';
import dva, { connect } from 'dva';
import createLoading from 'dva-loading';
import { Router, Route, Switch, routerRedux } from 'dva/router';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createMemoryHistory } from 'history';

const delay = time => new Promise(resolve => setTimeout(resolve, time));

const app = dva({
  ...createLoading(),
  history: createMemoryHistory(),  // Trick !!
  initialState: {}
});

app.model({
  namespace: 'user',
  state: {},
  reducers: {},
  effects: {
    *login ( action, { put, call } ) {
      yield call(delay, 1000);
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

const LoginPage = connect(({ loading }) => ({ loading }))(({ dispatch, loading: { effects } }) => {
  return (
    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {
        effects['user/login']
        ? <ActivityIndicator />
        : <TouchableOpacity onPress={() => dispatch({ type: 'user/login' })}>
            <Text style={{ fontSize: 24 }}>Login</Text>
          </TouchableOpacity>
      }
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
    <Switch>
      <Route path="/" exact component={LoginPage} />
      <Route path="/home" exact component={HomePage} />
    </Switch>
  </Router>
));

const App = app.start();

export default App;