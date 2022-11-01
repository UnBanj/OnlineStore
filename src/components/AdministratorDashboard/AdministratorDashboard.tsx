import React from 'react';
import { Card, Container, Table} from 'react-bootstrap';
import { faListAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Redirect } from 'react-router';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';




interface AdministratorDashboardState {
  isAdministratorLoggedIn: boolean;
  categories: CategoryType[];
}


class AdministratorDashboard extends React.Component {
  state: AdministratorDashboardState;

  constructor(props: Readonly<{}>) {
    super(props);

    this.state= {
      isAdministratorLoggedIn: true,
      categories: [],
   
    };
   
  }
 
  componentWillMount(){
    this.getCategories();
  }

  componentWillUpdate(){
    this.getCategories();
  }

 private getCategories(){
    api('/api/category/', 'get', {}, 'administrator')
    .then((res:ApiResponse) => {
        if(res.status === 'error' || res.status === 'login') {
            this.setLogginState(false);
            return;
        }
      
        this.putCategoriesInState(res.data);
    });
 }

 private putCategoriesInState(data? : ApiCategoryDto[]){
    const categories: CategoryType[] | undefined = data?.map(category => {
        return {
            categoryId: category.categoryId,
            name: category.name,
            parentCategoryId: category.parentCategoryId,
            
        };
    });

    const newState = Object.assign(this.state, {
      categories: categories,
    });

    this.setState(newState);
 }

 private setLogginState(isLoggedIn: boolean){
    this.setState(Object.assign(this.state, {
        isAdministratorLoggedIn: isLoggedIn,
    }));
      
 }


 render() {
   if(this.state.isAdministratorLoggedIn === false) {
     return (
      
       <Redirect to="/administrator/login" />
     );
     
   }

  return (
        <Container>
              <RoledMainMenu role="administrator"/>

              <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={ faListAlt }/> Categories
                    </Card.Title>
                    
                    <Table hover size="sm" bordered>
                      <thead>
                        <tr>
                          <td className='text-right'>ID</td>
                          <td>Name</td>
                          <td className='text-right'>Parent ID</td>
                        </tr>
                      </thead>
                      <tbody>
                        { this.state.categories.map(category => (
                          <tr>
                             <td className="text-right">{ category.categoryId}</td>
                             <td>{ category.name }</td>
                             <td className='text-right'>{ category.parentCategoryId}</td>
                          </tr>
                        ), this )}
                      </tbody>
                    </Table>
                                            
               </Card.Body>
            </Card>
        </Container>
  );
 }

}

export default AdministratorDashboard;
