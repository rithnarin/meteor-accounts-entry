import React, { Component } from 'react';
import OktaSignIn from '@okta/okta-signin-widget';
// import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
// import '@okta/okta-signin-widget/dist/css/okta-theme.css';

class SignIn extends Component {
  state = {
    local: Meteor.settings.public.useIDP === 'local', // change to false for local okta login
    email: '',
    password: '',
  }

  componentDidMount() {
    console.log('---->')
    if (!this.state.local) {
      this.showLogin();
    }
  }

  widget = new OktaSignIn({
    logo: '/img/signin-logo.png',
    baseUrl: `https://${Meteor.settings.public.okta.domain}`,
    clientId: Meteor.settings.public.okta.clientId,
    helpLinks: {
      forgotPassword: '/forgot-password',
      custom: [
        {
          text: 'Create an account',
          href: '/sign-up'
        }
      ]
    }
  });

  // handles okta login
  showLogin = () => {
    Backbone.history.stop();
    this.widget.renderEl(
      { el: this.loginContainer },
      (response) => {
        Meteor.loginWithOkta({}, (err) => {
          if (err) {
            console.error(err);
          }
        });
      },
      (err) => {
        console.error(err);
      },
    );
  }

  handleChange = (e) => {
    const { name } = e.target;
    this.setState({
      [name]: e.target.value,
    });
  }

  // handles local login
  handleSubmit = (e) => {
    e.preventDefault();
    Meteor.loginWithPassword(this.state.email, this.state.password, (err) => {
      if (err) {
        console.error(err);
      } else {
        Router.go('/');
      }
    });
  }

  renderLogin = () => {
    if (!this.state.local) {
      return (
        <div>
          <div ref={(div) => { this.loginContainer = div; }} />
          <p className="tag-line">Never Miss a Discovery®</p>
        </div>
      );
    }
    return (
      <div className="container">
        <div className="row">
          <div className="entry-logo">
            <a href="/"><img src='/img/signin-logo.png' alt="logo" /></a>
          </div>
          <div className="entry col-md-4 col-md-offset-4">
            <form className="entry-form" id="signIn" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input name="email" type="email" className="form-control" value={this.state.email} placeholder="Email address" onChange={this.handleChange} />
              </div>
              <div className="form-group">
                <input name="password" type="password" className="form-control" value={this.state.password} placeholder="Password" onChange={this.handleChange} />
              </div>
              <p><a href="/forgot-password">Forgot your password?</a></p>
              <button type="submit" className="submit btn btn-block btn-default">Sign In</button>

            </form>
            <p className="entry-signup-cta">Don't have an account? <a href="/sign-up">Register</a></p>
            <p className="tag-line">Never Miss a Discovery®</p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.renderLogin();
  }
}

export default SignIn;