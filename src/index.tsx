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
import { HashRouter, Route, Switch} from 'react-router-dom';
import ContactPage from './components/ContactPage/ContactPage';
import UserLoginPage from './components/UserLoginPage/UserLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import { UserRegistrationPage } from './components/UserRegistrationPage/UserRegistrationPage';
import OrderPage from './components/OrderPage/OrderPage';
import AdministratorLoginPage from './components/AdministratorLoginPage/AdministratorLoginPage';
import AdministratorDashboard from './components/AdministratorDashboardCategory/AdministratorDashboardCategory';
import AdministratorDashboardCategory from './components/AdministratorDashboard/AdministratorDashboard';
import AdministratorDashboardArticle from './components/AdministratorDashboardArticle/AdministratorDashboardArticle';
import { AdministratorLogoutPage } from './components/AdministratorLogoutPage/AdministratorLogoutPage';
import { UserLogoutPage } from './components/UserLogoutPage/UserLogoutPage';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <HashRouter>
  <React.StrictMode>
   
         <Switch>
         <Route exact path="/" component={ HomePage}/>
         <Route  path="/contact" component={ ContactPage} />
         <Route  path="/user/login" component={ UserLoginPage} />
         <Route  path="/user/logout" component={ UserLogoutPage} />
         <Route  path="/user/register" component={ UserRegistrationPage} />
         <Route path="/category/:cId" component={ CategoryPage } />
         <Route path="/user/orders/" component={ OrderPage } />
         <Route path="/administrator/login" component={ AdministratorLoginPage} />
         <Route path="/administrator/logout" component={ AdministratorLogoutPage} />
         <Route exact path="/administrator/dashboard/" component={ AdministratorDashboard} />
         <Route path="/administrator/dashboard/category/" component={ AdministratorDashboardCategory}/>
         <Route path="/administrator/dashboard/article" component={ AdministratorDashboardArticle} />
        </Switch> 
      
    </React.StrictMode>
    </HashRouter> 
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

