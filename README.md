## react-native-dva-starter-with-builtin-router

This example shows a way to integrate [dva](https://github.com/dvajs/dva) into react-native app with builtin router of dva.  
Since you don't need a router designed for react-native, this approach allows you to code any native app with dva just like web app.  

Try it at https://expo.io/@horiuchie/react-native-dva-starter-with-builtin-router.

<p align="center">
  <img width="191" height="338" src="https://github.com/horiuchie/react-native-dva-starter-with-builtin-router/blob/master/example.gif">
</p>

## How to integrate

1. `yarn global add expo-cli` if you have not installed yet.
2. `expo init {project-name}` then choose blank.
3. cd `{project-name}`.
4. `yarn add dva dva-loading react-dom`.
5. replace `App.js` with the following:

``` js
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
```

6. `expo start`. If your project on other networks, run `expo start --tunnnel`.
