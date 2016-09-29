var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Layout = React.createClass({

    //sets the initial logged in state
    getInitialState: function() {
        return {
            isLoggedIn: (null != firebase.auth().currentUser)
        }
    },

    //checks for login/logout changes and sets the logged in state accordingly, also gets the user's name
    componentWillMount: function() {
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({ isLoggedIn: (null != user)})
            userRef = firebase.database().ref().child('users/' + firebase.auth().currentUser.uid);
            userRef.on("value", snap => {
                var user = snap.val();
                this.setState({name: user.first + " " + user.last});
            });
        });
    },

    render: function() {
        var loginOrOut;
        var profile;
        var signUp;

        //if the user is logged in, show the logout and profile link
        if(this.state.isLoggedIn) {
            loginOrOut = <li><Link to="/logout" className="navbar-brand">Logout</Link></li>;
            profile = <li><Link to="/" className="navbar-brand">{this.state.name}</Link></li>
            signUp = null;
        //if the user is not logged in, show the login and signup links
        } else {
            loginOrOut = <li><Link to="/login" className="navbar-brand">Login</Link></li>;
            profile = null;
            signUp = <li><Link to="/signup" className="navbar-brand">Sign Up</Link></li>;
        }

        return (
            <span>
                <nav className="navbar navbar-inverse navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <Link to="/" className="navbar-brand">
                                SJSUConnect
                            </Link>
                        </div>
                        <ul className="nav navbar-nav pull-right">
                            {signUp} {/*shows only if user is not logged in*/}
                            {profile} {/*shows only if user is logged in*/}
                            {loginOrOut} {/*shows login or logout link depending on logged in state*/}
                        </ul>
                    </div>
                </nav>

            {/*shows the rest of the page: home, login, signup, etc. */}
                <div className="container">
                    {this.props.children}
                </div>
            </span>
        )
    }
});

module.exports = Layout;