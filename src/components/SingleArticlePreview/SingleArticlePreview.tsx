import React from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api, {ApiResponse} from '../../api/api';
import { ApiConfig } from '../../config/api.config';
import ArticleType from '../../types/ArticleType';


interface SingleArticlePreviewProperties {
    article: ArticleType,
}

interface SingleArticlePreviewState {
    quantity: number;
}

export default class SingleArticlePreview extends React.Component<SingleArticlePreviewProperties> {
    state: SingleArticlePreviewState;

    constructor(props: Readonly<SingleArticlePreviewProperties>){
        super(props);

        this.state = {
            quantity: 1,
        }
    }

    private quantityChanged(event: React.ChangeEvent<HTMLInputElement>){
        this.setState({
           quantity:Number(event.target.value),
        });
    }

    private addToCart(){
        const data = {
            articleId: this.props.article.articleId,
            quantity: this.state.quantity,
        };

        api('/api/user/cart/addToCart/', 'post', data)
         .then((res: ApiResponse) => {
            if(res.status === 'error' || res.status === 'login'){
                return;
            }
           //kreiramo custom event cart.update nad window 
            window.dispatchEvent(new CustomEvent('cart.update'));

         });
    }

    render(): React.ReactNode {
        return(
          <Col lg="4" md="6" sm="6" xs="12">
            <Card className="mb-3">
              <Card.Header>
                   <img alt= {this.props.article.name}
                        src={ ApiConfig.PHOTO_PATH  + this.props.article.imageUrl}
                        className="w-100"/>
              </Card.Header>
              <Card.Body>
              <Card.Title as="p">
                <strong>{ this.props.article.name }</strong>
              </Card.Title>
              <Card.Text>
                  {
                    this.props.article.excerpt  
                  }
              </Card.Text>
              <Card.Text>
                   Price: { Number(this.props.article.price).toFixed(2) } EUR
                  
              </Card.Text>
              <Form.Group>
                  <Row>
                      <Col xs="7">
                          <Form.Control type="number" min="1" step="1" value={ this.state.quantity}
                                        onChange={(e) => this.quantityChanged(e as any)}/>
                      </Col>
                      <Col xs="5">
                          <Button variant="secondary"
                                  onClick={() => this.addToCart() }>Buy</Button>
                      </Col>
                  </Row>
              </Form.Group>
              <Link to={ `/article/${this.props.article.articleId}`}
                className="btn btn-primary btn-block btn-sm">
              Open article page
              </Link>
              </Card.Body>

             </Card>
          </Col>
     );
        
    }
}