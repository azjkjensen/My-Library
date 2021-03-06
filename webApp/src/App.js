import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Main from "./Main";
import BookDetail from "./BookDetail/BookDetail";
import NotificationCenter from "./NotificationCenter/NotificationCenter";
import {addTimeoutNotification, addPersistentNotification} from "./reducers/notification";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {history} from './store';
import { ConnectedRouter } from 'react-router-redux'
import Library from "./Library/Library";
import store from './store';
import {getLoggedIn} from "./reducers/index";
import SearchResults from "./SearchResults/SearchResults";
// import GqlIntegration from "./Examples/GqlIntegration";

const colors=['orange','blue','black','silver','whitesmoke','green','pink','red'];


class App extends React.Component {

  constructor(props){
    super(props);
    this.showNotification = this.showNotification.bind(this);
    this.index = 0;
  }

  showNotification = () => {
    this.props.addTimeoutNotification(
       {
         id: 0,
         length: 2500,
         message: 'You did it! ' + ++this.index,
         color: colors[this.index % colors.length],
         key: this.index,
       });
  };

  showPersistentNotification = () => {
    this.props.addPersistentNotification(
       {
         id: 0,
         length: 2500,
         message: 'You did it! ' + ++this.index,
         color: colors[this.index % colors.length],
         key: this.index,
       });
  };


  render = () => (<div>
       <NotificationCenter />

       <main>
         <ConnectedRouter history={history}>
           <Switch>
             <Route path="/home" component={Main}/>
             {getLoggedIn(store.getState()) ? '': <Redirect to="/home" />}
             <Route path="/detail/:bookID" render={()=>(
                <BookDetail query="ender shadow"/>
             )} />
             <Route path="/library" render={()=>(
               <Library isLoggedIn={true}/>
             )} />
             <Route path="/search/:query" render={(props)=>{
               console.log("rerendering search " + props.match.params.query);
                return (
                  <SearchResults query={props.match.params.query}/>
                )
             }} />
              <Redirect to="/home"/> {/* Default route */}
           </Switch>
         </ConnectedRouter>
       </main>
       {/*<div onClick={this.showNotification}>Click me for a new timeout notification</div>*/}
       {/*<hr/>*/}
       {/*<div onClick={this.showPersistentNotification}>Click me for a new persistent notification</div>*/}
       {/*<GqlIntegration />*/}
     </div>
  );
}

const mapStateToProps = state => {
  console.log('Mapping state to props', state);
  return {
    notifications: state.notification.notifications,
    addTimeoutNotification: state.notification.addTimeoutNotification,
    addPersistentNotification: state.notification.addPersistentNotification,
  }};

const mapDispatchToProps = dispatch => bindActionCreators({
  addTimeoutNotification,
  addPersistentNotification,
}, dispatch);

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(App)
