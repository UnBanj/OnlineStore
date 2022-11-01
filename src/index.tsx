import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import { MainMenu, MainMenuItem } from './components/MainMenu/MainMenu';
import { HashRouter, Route, Switch} from 'react-router-dom';
import ContactPage from './components/ContactPage/ContactPage';
import UserLoginPage from './components/UserLoginPage/UserLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import { UserRegistrationPage } from './components/UserRegistrationPage/UserRegistrationPage';
import OrderPage from './components/OrderPage/OrderPage';
import AdministratorLoginPage from './components/AdministratorLoginPage/AdministratorLoginPage';
import AdministratorDashboard from './components/AdministratorDashboard/AdministratorDashboard';



const menuItems = [
  new MainMenuItem("Home","/"),
  new MainMenuItem("Contact","/contact/"),
  new MainMenuItem("Register","/user/register/"),
  new MainMenuItem("My Orders", "/user/orders/"),
  new MainMenuItem("User Log in","/user/login/"),
  new MainMenuItem("Administrator Log in", "/administrator/login/"),

 ];

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <HashRouter>
  <React.StrictMode>
   
    <MainMenu items={ menuItems}></MainMenu>
       <Switch>
         <Route exact path="/" component={ HomePage}/>
         <Route  path="/contact" component={ ContactPage} />
         <Route  path="/user/login" component={ UserLoginPage} />
         <Route  path="/user/register" component={ UserRegistrationPage} />
         <Route path="/category/:cId" component={ CategoryPage } />
         <Route path="/user/orders/" component={ OrderPage } />
         <Route path="/administrator/login" component={ AdministratorLoginPage} />
         <Route path="/administrator/dashboard" component={ AdministratorDashboard} />
        </Switch> 
      
    </React.StrictMode>
    </HashRouter> 
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

