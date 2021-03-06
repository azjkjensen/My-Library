import React from "react";
import {StyleSheet, css} from "aphrodite";
import {gql, graphql} from "react-apollo";
import {fadeInFromBelow, fadeOutToBelow} from "../utils/style/styleUtils";

const styles = StyleSheet.create({
  wrapper:{
    display: 'flex',
    justifyContent: 'space-around',
    position: 'absolute',
    left: 'calc(50vw - 200px)',
  },
  hide:{
    top: '102vh',
    animationName: fadeOutToBelow,
    animationDuration: '.5s',
    animationIterationCount: '1',
    // opacity: 0,
  },
  show:{
    top: '26vh',
    // opacity: 1,
    animationName: fadeInFromBelow,
    animationDuration: '.5s',
    animationIterationCount: '1',
  },
  login:{
    width: 400,
    height: 390,
    background: 'linear-gradient(#172a3c , whitesmoke)',
    // border: '1px solid #172a3c',
    borderRadius: 8,
    color: '#ffffff',
  },
  centerBox:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    flexWrap:'wrap',

    marginRight: 'auto',
    marginLeft: 'auto',
    height: '100%',
    padding: '5%',
  },

  inputLabel:{
    fontSize:'1.1em',
    display:'block',
    clear: 'both',
  },
  field:{
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  input:{
    width: 240,
    fontSize: '1.2em',
    borderRadius: 4,
  },
  submitButton:{
    width: 150,
    height: 48,
    fontSize: '1.2em',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 44,
    border: 'none',
    background: '#FFD363',
    color: '#172a3c',
    borderRadius: 4,
    transition: 'background .3s ease',
    ':hover':{
      background: '#ffe677',
    },
    ':focus':{
      outline: 'none',
    }
  },
  cancelButton:{
    width: '100%',
    ':focus':{
      outline: 'none'
    }
  }
});

class SignUp extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleUserCreated = this.handleUserCreated.bind(this);
  }

  handleInputChange = (event) => {
    console.log(event.target.name);
    switch(event.target.name){
      case 'firstName':
        this.setState({firstName: event.target.value});
        break;
      case 'lastName':
        this.setState({lastName: event.target.value});
        break;
      case 'email':
        this.setState({email: event.target.value});
        break;
      case 'pass':
        this.setState({password: event.target.value});
        break;
      default:
        break;
    }
  };

   handleUserCreated(res){
     if(res.data.createUser.id){
       this.props.onCreate();
     } else{
       // this.props.addTimeoutNotification(
       //    {
       //      id: 0,
       //      length: 2500,
       //      message: 'Welcome' + res.data.createUser.firstName,
       //      color: colors[this.index % colors.length],
       //      key: this.index,
       //    });
     }
   }

  handleSubmit(event){
    // User needs the following:
    //    su: Boolean!
    //    firstName: String!
    //    lastName: String!
    //    email: String!
    //    password: String!
    //    preferencesId: ObjID

    this.props.mutate({
      variables: {
        user: {
          ...this.state,
          su: false,
          library: [],
        }
      },
      refetchQueries:[
        {
          query: gql`query {
             users {
                 id
                 firstName
                 su
             }
          }`
        }
      ]
    })
    .then(this.handleUserCreated);
  }

  handleCancel(event){
    event.preventDefault();
    event.stopPropagation();
    this.props.onCancel();
  }

  render(){
    return (
       <div className={this.props.show ? css(styles.show, styles.wrapper) : css(styles.hide, styles.wrapper)}>
         <div className={css(styles.login)}>
           <form className={css(styles.centerBox)} onSubmit={(e) => {e.preventDefault();this.handleSubmit();}}>
             <label htmlFor="firstName" className={css(styles.field)}>
               <span className={css(styles.inputLabel)}>first name</span>
               <input type="text"
                      name="firstName"
                      value={this.state.firstName}
                      onChange={this.handleInputChange}
                      className={css(styles.input)}
               />
             </label>
             <label htmlFor="lastName" className={css(styles.field)}>
               <span className={css(styles.inputLabel)}>last name</span>
               <input type="text"
                      name="lastName"
                      value={this.state.lastName}
                      onChange={this.handleInputChange}
                      className={css(styles.input)}
               />
             </label>
             <label htmlFor="email" className={css(styles.field)}>
               <span className={css(styles.inputLabel)}>email</span>
               <input type="text"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleInputChange}
                      className={css(styles.input)}
               />
             </label>
             <label htmlFor="pass" className={css(styles.field)}>
               <span className={css(styles.inputLabel)}>Password</span>
               <input type="password"
                      name="pass"
                      value={this.state.password}
                      onChange={this.handleInputChange}
                      className={css(styles.input)}
               />
             </label>
             <input type="submit" value="submit" className={css(styles.submitButton)}/>
             <button className={"waterfall-button " + css(styles.cancelButton)}  onClick={this.handleCancel}>Cancel</button>
           </form>
         </div>
       </div>)
  }
}

export default graphql(gql`
    mutation userCreate($user: CreateUserInput!){
        createUser(input: $user){
            id
            su
            firstName
        }
    }
   `
)(SignUp);