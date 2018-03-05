## react-native-dva-starter-with-builtin-router

This example shows a way to integrate [dva](https://github.com/dvajs/dva) into react-native app with builtin router of dva.  
Since you don't need a router designed for react-native, this approach allows you to code any native app with dva just like web app.  

Try it at https://expo.io/@horiuchie/react-native-dva-starter-with-builtin-router.

<p align="center">
  <img width="254" height="450" src="https://github.com/horiuchie/react-native-dva-starter-with-builtin-router/blob/master/example.gif">
</p>

## How to integrate

1. `yarn global add exp` if you have not installed yet.
2. `exp init project-name` then choose blank.
3. cd `project-name`.
4. `yarn add dva react-dom`.
5. replace `App.js` with the following:

``` js
import React from 'react';
import dva, { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { createMemoryHistory as createHistory } from 'history';
import { View, Text, TouchableOpacity } from 'react-native';
import { Router, Route, Switch } from 'dva/router';

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
    <Switch>
      <Route path="/" exact component={LoginPage} />
      <Route path="/home" exact component={HomePage} />
    </Switch>
  </Router>
));

const App = app.start();

export default App;
```

6. `exp start`. If your project on other networks, run `exp start --host tunnnel`.


## Add a stack component

[react-router-native-stack](https://github.com/Traviskn/react-router-native-stack) is available if you want swiping back and animation.  

1. `yarn add react-router-native react-router-native-stack`.
2. In `App.js`, replace `Switch` with `Stack`:

``` diff
-import { Router, Route, Switch } from 'dva/router';
+import { Router, Route } from 'dva/router';
+import Stack from 'react-router-native-stack';

...

app.router(({ history }) => (
  <Router history={history}>
-   <Switch>
+   <Stack>
      <Route path="/" exact component={LoginPage} />
      <Route path="/home" exact component={HomePage} />
-    </Switch>
+    </Stack>
  </Router>
));
```
