import { faListAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import CategoryType from "../../types/CategoryType";
import api, { ApiResponse } from "../../api/api";
import ArticleType from "../../types/ArticleType";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { ApiConfig } from "../../config/api.config";
import SingleArticlePreview from "../SingleArticlePreview/SingleArticlePreview";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface CategoryPageProperties {
   match: {
       params: {
           cId: number;
       }
   }
}

interface CategoryPageState {
    isUserLoggedIn: boolean;
    category?: CategoryType;
    subcategories?: CategoryType[];
    articles?: ArticleType[];
    message: string;
    filters: {
      keywords: string;
      priceMinimum: number;
      priceMaximum: number;
      order: "name asc" | "name desc" | "price asc" | "price desc";
      selectedFeatures: {
          featureId: number;
          value: string;
      }[];
    };
    features: {
      featureId: number;
      name: string;
      values: string[];
    }[];
}

interface CategoryDto {
    categoryId: number;
    name: string;
}

interface ArticleDto {
    aticleId: number;
    name: string;
    excerpt?: string;
    description?: string;
    articlePrices?: {
        price: number;
        createdAt: string;
    }[];
    photos?: {
        imagePath: string;
    }[];
}

export default class CategoryPage extends React.Component<CategoryPageProperties> {
    state: CategoryPageState;

    constructor (props: Readonly<CategoryPageProperties>)  {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            message: '',
            filters: {
                keywords: '',
                priceMinimum: 0.01,
                priceMaximum: 100000,
                order: "price asc",
                selectedFeatures: [],
            },
            features: [],//polazna pretpostavka je da nece biti dostavljen nijedan feature

        };
     }

     private setFeatures(features: any ){
        const newState = Object.assign(this.state, {
           features: features,
        });

        this.setState(newState);
    }

     private setLogginState(isLoggedIn: boolean){
         const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
         });

         this.setState(newState);
     }

     private setMessage(message: string){
         const newState = Object.assign(this.state, {
            message: message,
         });

         this.setState(newState);
     }

     private setCategoryData(category: CategoryType){
        const newState = Object.assign(this.state, {
           category: category,//assignovanje na stari state sa izmenom jedne komponente
        });

        this.setState(newState);//a onda to setujemo kao state
    }
    
    
    private setSubcategories(subcategories: CategoryType[]) {
        this.setState(Object.assign(this.state, {
            subcategories: subcategories,
        }));
    }

    private setArticles(articles: ArticleType[]) {
        this.setState(Object.assign(this.state, {
            articles: articles,
        }));
    }
    

     render(){ 
        if(this.state.isUserLoggedIn === false){
            return(
                <Redirect to="/user/login" />
            );
        }

        return (
        
          <Container>
              <RoledMainMenu role="user" />

              <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={ faListAlt }/> { this.state.category?.name }
                    </Card.Title>
                    <>
                    {this.printOptionalMessage()}
                    
                    { this.showSubcategories()}

                    <Row>
                        <Col xs="12" md="4" lg="3">
                            {this.printFilters()}
                        </Col>
                        <Col xs="12" md="8" lg="9">
                        { this.showArticles()}
                        </Col>
                    </Row>
                  
                    </>
                </Card.Body>
              
            </Card>
            
        </Container>
       
        );
     }

     private setNewFilter(newFilter: any){
         this.setState(Object.assign(this.state, {
             filter: newFilter,
         }));
     }

     private filterKeywordsChanged(event: React.ChangeEvent<HTMLInputElement>){
        this.setNewFilter(Object.assign(this.state.filters, {
            keywords: event.target.value,
        }));
         
     }

     private filterPriceMinChanged (event: React.ChangeEvent<HTMLInputElement>){
        this.setNewFilter(Object.assign(this.state.filters, {
            priceMinimum: Number(event.target.value),
        }));
    }
     private filterPriceMaxChanged(event: React.ChangeEvent<HTMLInputElement>): void{
        this.setNewFilter(Object.assign(this.state.filters,{
            priceMaximum: Number(event.target.value)
        }));
     }
    
     private filterOrderChanged(event: React.ChangeEvent<HTMLSelectElement>){
       this.setNewFilter(Object.assign(this.state.filters,{
           order: event.target.value,
       }));
     }

     private featureFilterChanged(event: React.ChangeEvent<HTMLInputElement>) {
         const featureId = Number(event.target.dataset.featureId);
         const value = event.target.value;

         if(event.target.checked){
           this.addFeatureFilterValue(featureId, value);
         } else {
           this.removeFeatureFilterValue(featureId, value);
         }
    }

    private addFeatureFilterValue(featureId: number, value: string){
       const newSelectedFeatures = [... this.state.filters.selectedFeatures];//kopija starog selectedFeatures
       newSelectedFeatures.push({ //u koji dodajemo novi record   
          featureId: featureId,
          value: value
       });

       this.setSelectedFeatures(newSelectedFeatures);
    }
    
    private removeFeatureFilterValue(featureId: number, value: string){//trazimo sve one koji ne odgovaraju filteru(nemaju istu vrednost featureId sa ovim featureId)
        const newSelectedFeatures = this.state.filters.selectedFeatures.filter(record=> {//filter uzima jedan po jedan record(zapis)
             return !(record.featureId === featureId && record.value === value)
        });//vrati rezultat negacije ovog filtriranja
      
        this.setSelectedFeatures(newSelectedFeatures);
    }

    private setSelectedFeatures(newSelectedFeatures: any){
        this.setState(Object.assign(this.state, {//setujemo stanje tako sto uzmemo staro stanje
            filters: Object.assign(this.state.filters, {//zamenimo njegov filters novim 
                selectedFeature: newSelectedFeatures,//unutar kojeg zamenimo samo selectedFilters vrednost
            })
        }));

        console.log(this.state);
    }

     private printFilters(){
         return (
             <>
               <Form.Group>
                   <Form.Label htmlFor="keywords">Search keywords:</Form.Label>
                   <Form.Control type="text" id="keywords"
                                 value={ this.state.filters.keywords}
                                 onChange= {(e)=> this.filterKeywordsChanged(e as any)}/>
               </Form.Group>
               <Form.Group>
                   <Row>
                       <Col xs="12" sm="6">
                           <Form.Label htmlFor="priceMin">Minimum price:</Form.Label>
                           <Form.Control type="number" id="priceMin"
                                         step="0.01" min="0.01" max="99999.99"
                                         value={this.state.filters.priceMinimum}
                                         onChange= {(e)=> this.filterPriceMinChanged(e as any)}/>
                       </Col>
                       <Col xs="12" sm="6">
                           <Form.Label htmlFor="priceMax">Maximum price:</Form.Label>
                           <Form.Control type="number" id="priceMax"
                                         step="0.01" min="0.02" max="100000"
                                         value={this.state.filters.priceMaximum}
                                         onChange= {(e)=> this.filterPriceMaxChanged(e as any)}/>
                       </Col>
                   </Row>
               </Form.Group>
               <Form.Group>
                   <Form.Control as="select" id="sortOrder"
                                 value= {this.state.filters.order}
                                 onChange= {(e)=> this.filterOrderChanged(e as any)}>
                       <option value="name asc">Sort by name - ascending</option>
                       <option value="name desc">Sort by name - descending</option>
                       <option value="price asc">Sort by price - ascending</option>
                       <option value="price desc">Sort by price - descending</option>
                   </Form.Control>
               </Form.Group>
               
               { this.state.features.map(this.printFeatureFilterComponent, this) }
               
               <Form.Group>
                   <Button variant="primary" onClick={ () => this.applyFilters()}>
                       <FontAwesomeIcon icon={ faSearch }/> Search
                   </Button>
               </Form.Group>
                       
             </>
         );

             
     }

     private printFeatureFilterComponent(feature: { featureId: number; name: string; values: string[];}){
        return (
            <Form.Group>
                <>
                <Form.Label><strong>{ feature.name }</strong></Form.Label>
                { feature.values.map(value => this.printFeatureFilterCheckbox(feature, value), this) }
                </>
            </Form.Group>
        );  
     }

     private printFeatureFilterCheckbox(feature:any, value: string){
        return(
            <Form.Check type="checkbox" label={ value }
                        value = {value}
                        data-feature-id = {feature.featureId}
                        onChange = {(e)=> this.featureFilterChanged(e as any)}/>
        )
     }
    
     private applyFilters(){
         this.getCategoryData();
     }

     private showArticles(){
         if(this.state.articles?.length === 0){
             return (
                 <div>There are no articles in this category.</div>
             );
         }

         return(
             <Row>
                 { this.state.articles?.map(this.singleArticle)}
             </Row>
         );
     }

     private singleArticle(article: ArticleType){
         return (
            <SingleArticlePreview article={article} />
         );
     }

     private printOptionalMessage(){
       if(this.state.message === '' ){
           return;
       }
       return (
        <Card.Text>
          {this.state.message }
        </Card.Text>
        );
     }

     private showSubcategories(){
         if(this.state.subcategories?.length === 0){
             return;
         }

       return (
           <Row>
               { this.state.subcategories?.map(this.singleCategory)}
           </Row>
       );
     }

     
private singleCategory(category: CategoryType){
    return(
       <Col lg="3" md="4" sm="6" xs="12">
           <Card className="mb-3">
             <Card.Body>
             <Card.Title as="p">
               { category.name }
             </Card.Title>
             <Link to={ `/category/${category.categoryId}`}
                  className="btn btn-primary btn-block btn-sm">
                Open category
             </Link>
             </Card.Body>
  
           </Card>
       </Col>
    );
  }

     componentDidMount() {//kada se prvi put montira nasa komponenta
        this.getCategoryData();
     }

     componentDidUpdate(oldProperties: CategoryPageProperties){
         //ako je stranica vec ucitana nema razloga ponovo da se ucitava
        if(oldProperties.match.params.cId === this.props.match.params.cId){
            return;
        }
        this.getCategoryData(); //u slucaju da nije - ucitaj
     }

     private getCategoryData() {
       api('api/category/' + this.props.match.params.cId, 'get', {})
        .then((res: ApiResponse)=> {
               if (res.status === 'login'){
                   return this.setLogginState(false);
               }

               if(res.status === 'error'){
                  return this.setMessage('Request error. Please try to refresh the page.');
               }
            
               //ako je sve okej
               const categoryData: CategoryType = {
                   categoryId: res.data.categoryId,
                   name: res.data.name,
               };

               this.setCategoryData(categoryData);

               const subcategories: CategoryType[] =  //lista CategoryType objekata 
                res.data.categories.map((category: CategoryDto) => {
                    return {
                        categoryId: category.categoryId,
                        name: category.name,
                    }
                });


               this.setSubcategories(subcategories);
            
        });

        const orderParts = this.state.filters.order.split(' ');
        const orderBy = orderParts[0];
        const orderDirection = orderParts[1].toUpperCase();

        const featureFilters: any[] = [ ];

        for(const item of this.state.filters.selectedFeatures){
            let found = false;//polazna pret da ne postoji 
            let foundRef = null;

            for(const featureFilter of featureFilters){
                if(featureFilter.featureId === item.featureId){
                    found = true;
                    foundRef = featureFilter;
                    break;
                }
            }
            //ako ne postoji
            if(!found){
                featureFilters.push({//dodajemo jedan novi zapis
                   featureId: item.featureId,
                   values: [ item.value ],
                });
            } else {
                foundRef.values.push(item.value);
            }
        }

        api('api/article/search/', 'post', {
            categoryId: Number(this.props.match.params.cId),
            keywords: this.state.filters.keywords,
            priceMin: this.state.filters.priceMinimum,
            priceMax: this.state.filters.priceMaximum,
            features: featureFilters,
            orderBy: orderBy,
            orderDirection: orderDirection,
        })
        .then((res: ApiResponse)=> {
            if(res.status === 'login'){
                return this.setLogginState(false);
            }

            if(res.status === 'error') {
                return this.setMessage('Request error.Please try to refresh the page.');
            }

            const articles: ArticleType[] =
            res.data.map((article: ArticleDto) => {

              const object: ArticleType = {
                articleId: article.aticleId,
                name: article.name,
                excerpt: article.excerpt,
                description: article.description,
                imageUrl: '',
                price: 0,
              };
              
              if(article.photos !== undefined && article.photos?.length > 0){
                  object.imageUrl = article.photos[article.photos?.length-1].imagePath;
              }

              if(article.articlePrices !== undefined && article.articlePrices?.length > 0){
                  object.price = article.articlePrices[article.articlePrices?.length-1].price;
                  
              }

              return object;
            });

            this.setArticles(articles);
        });

        this.getFeatures();
     }

     getFeatures(){
         api('api/feature/values/'+ this.props.match.params.cId, 'get',{})
         .then((res:ApiResponse) => {
             if(res.status === 'login'){//ukoliko je dobio login error ponovo ulogovati korisnika
                return this.setLogginState(false);
             }

             if(res.status === 'error'){//neki drugi error
                 return this.setMessage('Request error.Please try to refresh the page.');
             }

             this.setFeatures(res.data.features);
         });

     }
}