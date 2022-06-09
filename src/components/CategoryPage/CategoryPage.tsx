import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Container } from "react-bootstrap";
import CategoryType from "../../types/CategoryType";
import api, { ApiResponse } from "../../api/api";
import ArticleType from "../../types/ArticleType";

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
}

export default class CategoryPage extends React.Component<CategoryPageProperties> {
    state: CategoryPageState;

    constructor (props: Readonly<CategoryPageProperties>)  {
        super(props);

        this.state = {
            isUserLoggedIn: true,
        };
     }
    

     render(){
        return (
            <Container>
              <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={ faListAlt }/> { this.state.category?.name }
                    </Card.Title>
                    <Card.Text>
                        Ovde cemo imati nase artikle..
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
        );
     }

     componentWillMount() {
        this.getCategoryData();
     }

     componentWillReceiveProps(newProperties: CategoryPageProperties){
         //ako je stranica vec ucitana nema razloga ponovo da se ucitava
        if(newProperties.match.params.cId === this.props.match.params.cId){
            return;
        }
        this.getCategoryData(); //u slucaju da nije - ucitaj
     }

     private getCategoryData() {
       api('api/category/' + this.props.match.params.cId, 'get', {})
        .then((res: ApiResponse)=> {
               
        })
     }
}