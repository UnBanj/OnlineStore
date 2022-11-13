import React from 'react';
import { Alert, Button, Card, Col, Container, Form, FormGroup, Modal, Row, Table} from 'react-bootstrap';
import { faEdit, faListAlt, faPlus} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Redirect } from 'react-router';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import ArticleType from '../../types/ArticleType';
import ApiArticleDto from '../../dtos/ApiArticleDto';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';
import { Settings } from 'http2';
import { features } from 'process';




interface AdministratorDashboardArticleState {
  isAdministratorLoggedIn: boolean;
  articles: ArticleType[];
  categories: CategoryType[];
  status: string[];

  addModal: {
    visible: boolean;
    name: string;
    message: string;
    categoryId: number;
    description: string;
    excerpt: string;
    status: string;
    isPromoted: number;
    price: number;
    features:{
      use: number;
      featureId: number;
      name: string;
      value: string;
    }[];
  };

  editModal: {
    articleId?: number;
    visible: boolean;
    name: string;
    message: string;
    categoryId: number;
    description: string;
    excerpt: string;
    status: string;
    isPromoted: number;
    price: number;
    features:{
      use:number;
      featureId: number;
      name: string;
      value: string;
    }[];
  };
}

interface FeatureBaseType{
  featureId: number;
  name: string;
}

class AdministratorDashboardArticle extends React.Component {
  state: AdministratorDashboardArticleState;

  constructor(props: Readonly<{}>) {
    super(props);

    this.state= {
      isAdministratorLoggedIn: true,
      articles: [],
      categories: [],
      status: [
        "available",
        "visible",
        "hidden"
      ],

      addModal: {
        visible: false,
        name: '',
        message: '',
        categoryId: 1,
        excerpt: '',
        description: '',
        status: 'available',
        isPromoted: 0,
        price: 0.01,
        features: []
      },

      editModal: {
        visible: false,
        name: '',
        message: '',
        categoryId: 1,
        excerpt: '',
        description: '',
        status: 'available',
        isPromoted: 0,
        price: 0.01,
        features: []
      }
   
    };
   
  }

  private async getFeaturesByCategoryId(categoryId: number): Promise<FeatureBaseType[]> {
  return new Promise(resolve => {
    api('api/feature/?filter=categoryId||$eq||' + categoryId + '/','get',{},'administrator')
    .then((res:ApiResponse) => {
      if(res.status === "error" || res.status === "login"){
        this.setLogginState(false);
        return resolve([]);//vracamo resolve praznog niza 
      }

      const features: FeatureBaseType[] = res.data.map((item: any) => ({
        featureId: item.featureId,
        name: item.name,
      }));

      resolve(features);
    })
  })
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
            imagePath: category.imagePath,
            parentCategoryId: category.parentCategoryId,
            
        };
    });

    this.setState(Object.assign(this.state, {
      categories: categories,
    }));
 }

  private setAddModalVisibleState(newState: boolean){
    this.setState(Object.assign(this.state, 
      Object.assign(this.state.addModal, {
      visible: newState
    })
    ));
  }

  private setAddModalFeatureUse(featureId: number, use: boolean){
       const addFeatures:{featureId: number;use: number;}[] = [...this.state.addModal.features];//pravimo kopiju tog niza
       for (const feature of addFeatures){
        if(feature.featureId === featureId){
          feature.use = use ? 1: 0;
          break;
        }
       }

       this.setState(Object.assign(this.state,
                     Object.assign(this.state.addModal,{
                      features: addFeatures,
                     }),
                  ));
  }
  
  private setAddModalFeatureValue(featureId: number, value: string){
    const addFeatures:{featureId: number;value: string;}[] = [...this.state.addModal.features];//pravimo kopiju tog niza
    for (const feature of addFeatures){
     if(feature.featureId === featureId){
       feature.value = value;
       break;
     }
    }

    this.setState(Object.assign(this.state,
                  Object.assign(this.state.addModal,{
                   features: addFeatures,
                  }),
               ));
  }

  private setAddModalStringFieldState(fieldName: string, newValue: string){
    this.setState(Object.assign(this.state,
        Object.assign(this.state.addModal,{
          [ fieldName]: newValue,
        })
       ));
  }

  private setAddModalNumberFieldState(fieldName: string, newValue: any){
    this.setState(Object.assign(this.state,
        Object.assign(this.state.addModal,{
          [ fieldName]: (newValue === 'null') ? null : Number(newValue), //ako je text.vrednost null setuj na null,u suprotnom upisati Number reprezentaciju vrednosti newValue
        })
       ));
  }
 
  private setEditModalVisibleState(newState: boolean){
    this.setState(Object.assign(this.state, 
      Object.assign(this.state.editModal, {
      visible: newState
    })
    ));
  }

  private setEditModalStringFieldState(fieldName: string, newValue: string){
    this.setState(Object.assign(this.state,
        Object.assign(this.state.editModal,{
          [ fieldName]: newValue,
        })
       ));
  }

  private setEditModalNumberFieldState(fieldName: string, newValue: any){
    this.setState(Object.assign(this.state,
        Object.assign(this.state.editModal,{
          [ fieldName]: (newValue === 'null') ? null : Number(newValue), //ako je text.vrednost null setuj na null,u suprotnom upisati Number reprezentaciju vrednosti newValue
        })
       ));
  }

  componentDidMount(){
    this.getArticles();
    this.getCategories();
  }

 private getArticles(){
    api('/api/article/?join=articleFeatures&join=features&join=articlePrices&join=photos&join=category', 'get', {}, 'administrator')
    .then((res:ApiResponse) => {
        if(res.status === 'error' || res.status === 'login') {
            this.setLogginState(false);
            return;
        }
      
        this.putArticlesInState(res.data);
    });
 }

 private putArticlesInState(data? : ApiArticleDto[]){
    const articles: ArticleType[] | undefined = data?.map(article => {
        return {
            articleId: article.articleId,
            name: article.name,
            excerpt: article.excerpt,
            description: article.description,
            imageUrl: article.photos[0].imagePath,
            price: article.articlePrices[article.articlePrices.length-1].price,
            status: article.status,
            isPromoted: article.isPromoted,
            articleFeatures: article.articleFeatures,
            features: article.features,
            articlePrices: article.articlePrices,
            photos: article.photos,
            category: article.category,
          };

          this.setState(Object.assign(this.state, {
            articles: articles,
          }));
    });

    const newState = Object.assign(this.state, {
      articles: articles,
    });

    this.setState(newState);
 }

 private setLogginState(isLoggedIn: boolean){
    this.setState(Object.assign(this.state, {
        isAdministratorLoggedIn: isLoggedIn,
    }));
      
 }

 private async addModalCategoryChanged(event: React.ChangeEvent<HTMLSelectElement>){
    this.setAddModalNumberFieldState('categoryId', event.target.value);

    const features = await this.getFeaturesByCategoryId(this.state.addModal.categoryId);
    const stateFeatures = features.map(feature=> ({
         featureId: feature.featureId,
         name: feature.name,
         value: '',
         use: 0,
    }));

    this.setState(Object.assign(this.state, 
         Object.assign(this.state.addModal, {
          feature: stateFeatures,
         }),
      ));
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
                        <FontAwesomeIcon icon={ faListAlt }/> Articles
                    </Card.Title>
                    
                    <Table hover size="sm" bordered>
                      <thead>
                       <tr>
                           <th colSpan={6}></th>
                           <th className='text-center'>
                              <Button variant="primary" size="sm"
                                      onClick={ () => this.showAddModal()}>
                                <FontAwesomeIcon icon={ faPlus}/> Add
                              </Button>
                           </th>

                       </tr>

                       <tr>
                          <th className='text-right'>ID</th>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Status</th>
                          <th>Promoted</th>
                          <th className='text-right'>Price</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        { this.state.articles.map(article => (
                          <tr>
                             <td className="text-right">{ article.articleId}</td>
                             <td>{ article.name }</td>
                             <td>{ article.category?.name}</td>
                             <td>{ article.status }</td>
                             <td>{ article.isPromoted ? 'Yes':'No'}</td>
                             <td className='text-right'>{ article.price}</td>
                             <td className='text-center'>
                                 <Button variant="info" size="sm"
                                         onClick={ () => this.showEditModal(article)}>
                                     <FontAwesomeIcon icon={faEdit} /> Edit
                                 </Button>
                             </td>
                          </tr>
                        ), this )}
                      </tbody>
                    </Table>
                                            
               </Card.Body>
            </Card>

            <Modal size="lg" centered show={ this.state.addModal.visible} onHide={ () => this.setAddModalVisibleState(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Add new article</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   <Form.Group>
                     <Form.Label htmlFor="name">Name</Form.Label>
                     <Form.Control id="name" type="text" value={this.state.addModal.name}
                                   onChange={(e)=> this.setAddModalStringFieldState('name',e.target.value)} />
                                   
                   </Form.Group>
                   <FormGroup>
                      <Form.Label htmlFor="excerpt">Short text</Form.Label>
                      <Form.Control id="excerpt" type="text" value={ this.state.addModal.excerpt}
                                    onChange={(e) => this.setAddModalStringFieldState('excerpt', e.target.value)}/>
                   </FormGroup>
                   <Form.Group>
                      <Form.Label htmlFor="add-description">Detailed text</Form.Label>
                      <Form.Control id="add-description" as={"textarea"} value={ this.state.addModal.description}
                                    onChange={(e) => this.setAddModalStringFieldState('description', e.target.value)}
                                    rows={10}/>
                   </Form.Group>
                   <Form.Group>
                      <Form.Label htmlFor="add-categoryId">Category</Form.Label>
                      <Form.Control id="add-categoryId" as={"select"} value={ this.state.addModal.categoryId.toString()}
                                    onChange={(e) => this.addModalCategoryChanged(e as any)}>
                                    {
                                      this.state.categories.map(category => (
                                        <option value={ category.categoryId?.toString()}>
                                          { category.name }
                                        </option>
                                      ))
                                    }
                      </Form.Control>
                   </Form.Group>
                   <Form.Group>
                      <Form.Label htmlFor="add-status">Status</Form.Label>
                      <Form.Control id="add-status" as={"select"} value={ this.state.addModal.status.toString()}
                                    onChange={(e) => this.setAddModalStringFieldState('status',e.target.value)}>
                                   <option value="available">Available</option>
                                   <option value="visible">Visible</option>
                                   <option value="hidden">Hidden</option>
                      </Form.Control>
                   </Form.Group>
                   <Form.Group>
                      <Form.Label htmlFor="add-isPromoted">Promoted?</Form.Label>
                      <Form.Control id="add-isPromoted" as={"select"} value={ this.state.addModal.isPromoted.toString()}
                                    onChange={(e) => this.setAddModalNumberFieldState('isPromoted',e.target.value)}>
                                    <option value="0">Not promoted</option>    
                                    <option value="1">Is promoted</option>                             
                              
                      </Form.Control>
                   </Form.Group>

                   <div>
                       { this.state.addModal.features.map(this.printAddModalFeatureInput, this)}
                   </div>


                   <Form.Group>
                      <Button variant="primary" onClick={ ()=> this.doAddArticle()}>
                        <FontAwesomeIcon icon={ faPlus}/>Add new article
                      </Button>
                   </Form.Group>
                   { this.state.addModal.message ? ( //ukoliko postoji prikazujemo mess, u suprotnom ne prik. nista
                       <Alert variant="danger" defaultValue={this.state.addModal.message}/>
                   ) : ''}
                </Modal.Body>
            </Modal>

        </Container>
  );
 }

 private printAddModalFeatureInput(feature: any){
   return (
     <Form.Group>
        <Row>
          <Col xs="4" sm="2">
          <input type="checkbox" value="1" checked={ feature.use === 1}
              onChange={ (e) => this.setAddModalFeatureUse(feature.featureId, e.target.checked)}/>
          </Col>
          <Col xs="8" sm="5">
                { feature.name }
          </Col>
          <Col xs="12" sm="5">
          <Form.Control type="text" value={ feature.value } 
                     onChange={ (e) => this.setAddModalFeatureValue( feature.featureId, e.target.value)}/>
          </Col>
        </Row>
        
      </Form.Group>
   );
 }

 private showAddModal(){
    this.setAddModalStringFieldState('name','');
    this.setAddModalStringFieldState('imagePath','');
    this.setAddModalNumberFieldState('parentCategotyId', 'null');
    this.setAddModalStringFieldState('message','');
    this.setAddModalVisibleState(true);

 }

 private showEditModal(article: ArticleType){
  this.setEditModalStringFieldState('name',String(article.name));
  this.setEditModalNumberFieldState('articleId', article.articleId);
  this.setEditModalStringFieldState('message','');
  this.setEditModalVisibleState(true);

}

 private doAddArticle(){
    api('/api/article/', 'post',{
      name: this.state.addModal.name,
   
    },'administrator')
    .then((res:ApiResponse) => {
      if( res.status === 'login'){
        this.setLogginState(false);
        return;
      }
      
      if(res.status === 'error'){
        this.setAddModalStringFieldState('message', JSON.stringify(res.data));
        return;
      }

      this.setAddModalVisibleState(false);//sakrijemo modal
      this.getArticles(); //Ponovo ucitavamo da bismo videli novu dodatu
    });
 }

 private doEditArticle(){
  api('/api/article/'+ this.state.editModal.articleId,'patch',{
    
     },'administrator')
  .then((res:ApiResponse) => {
    if(res.status === "login"){
    this.setLogginState(false);
    return;
   }

   if(res.status === "error"){
      this.setAddModalStringFieldState('message', JSON.stringify(res.data));
      return;
   }

   this.setEditModalVisibleState(false);
   this.getArticles();
  });


 }

}

export default AdministratorDashboardArticle;
