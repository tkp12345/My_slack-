import React from 'react';
import {Switch,Route,Redirect} from "react-router";
import loadable from '@loadable/component'

const  SignUp = loadable(()=> import("../pages/SignUp"));
const  Login = loadable(()=> import("../pages/Login"));
const  Workspace = loadable(()=> import("../layouts/Workspace/Workspace"));


const App = () => {
    return <Switch>
        <Redirect  exact path="/" to="/login"/>
        <Route   path="/login" component={Login}/>
        <Route   path="/signup" component={SignUp}/>
        <Route   path="/workspace/:workspace" component={Workspace}/>
    </Switch>
};

export default App;