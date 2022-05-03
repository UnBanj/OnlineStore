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



const menuItems = [
  new MainMenuItem("Home","/"),
  new MainMenuItem("Contact","/contact/"),
  new MainMenuItem("Log in","/user/login/"),

  new MainMenuItem("Cat 1","/category/1/"),
  new MainMenuItem("Cat 7","/category/7/"),
  new MainMenuItem("Cat 21","/category/21/"),
  
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
         <Route path="/category/:cId" component={ CategoryPage } />
        </Switch> 
      
    </React.StrictMode>
    </HashRouter> 
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

