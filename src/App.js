import React, {Component, Fragment} from 'react';
import axios from 'axios'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'


import Navbar from './components/layout/Navbar'
import Alert from './components/layout/Alert'
import Users from './components/users/Users'
import User from './components/users/User'
import Search from './components/users/Search'
import About from './components/pages/About'

import './App.css';

class App extends Component {
  state={
    users: [],
    user:{},
    repos: [],
    loading: false,
    alert: null
  }

  async componentDidMount(){
    this.setState({loading: true})
    const res = await axios
    .get(`https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)

    this.setState({users: res.data, loading: false})
  }
  
  searchUsers = async (text)=>{
    console.log(text) 
    this.setState({loading: true})
    const res = await axios
    .get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)

    this.setState({users: res.data.items, loading: false}) 
  }

  // Getting a single github User.
  getUser = async (username) =>{
    this.setState({loading: true})
    const res = await axios
    .get(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)

    this.setState({user: res.data, loading: false})
  }

  // Getting user Repos
  getUserRepos = async (username) =>{
    this.setState({loading: true})
    const res = await axios
    .get(`https://api.github.com/users/${username}/repos?per_page=10&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)

    this.setState({repos: res.data, loading: false})
  }

  clearUsers = () =>{
    this.setState({
      users:[],
      loading: false
    })
  }

  setAlert = (message, type) =>{
    this.setState({
      alert:{
        message: message,
        type: type
      }
    })
    setTimeout(()=> this.setState({alert: null}), 3000)
  }
  
  render(){
    return (
      <Router>
        <div >
          <Navbar title="Github Finder" icon="fab fa-github"/>
          <div className="container">
            <Alert alert={this.state.alert}/>
            <Switch>
              <Route exact path='/' render={props =>(
                <Fragment>
                  <Search 
                    searchUsers={this.searchUsers} 
                    clearUsers={this.clearUsers} 
                    showClear={this.state.users.length > 0 ? true : false}
                    setAlert={this.setAlert} />
                  <Users 
                  loading={this.state.loading} 
                  users={this.state.users} />
                </Fragment>
              )} />
              <Route exact path='/about' component={About}/>
              <Route exact path='/user/:login' render={props =>(
                <User 
                  {...props} 
                  getUser={this.getUser} 
                  getUserRepos={this.getUserRepos} 
                  user={this.state.user} 
                  repos={this.state.repos}
                  loading={this.state.loading} />
              )} />
            </Switch>
          </div>
        </div>
      </ Router>  
    );
  }
}

export default App;
