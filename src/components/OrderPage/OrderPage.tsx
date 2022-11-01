import { faBox, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Container, Modal, Table } from 'react-bootstrap';
import { Redirect } from 'react-router';
import api, { ApiResponse } from '../../api/api';
import CartType from '../../types/CartType';
import OrderType from '../../types/OrderType';

interface OrderPageState {
    isUserLoggedIn: boolean;
    orders: OrderType[];
    cartVisible: boolean;
    cart?: CartType;
}

interface OrderDto {
    orderId: number;
    createdAt: string;
    status: "rejected" | "accepted" | "shipped" | "pending";
    cart: {
      cartId: number;
      createdAt: string;
      cartArticles: {
        quantity: number;
        article: {
            articleId: number;
            name: string;
            excerp: string;
            status: "availible" | "visible" | "hidden";
            isPromoted: number;
            category: {
               categoryId: number,
               name: string
            },
            articlePrices: {
                 price: number,
                 createdAt: string,
            }[];
            photos: {
               imagePath: string; 
            }[];

        };
      }[];
    };
}

export default class OrderPage extends React.Component {
    state: OrderPageState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
            isUserLoggedIn: true,
            orders: [],
            cartVisible: false,

        }
    }
     
    private setCartState(cart: CartType){
        this.setState(Object.assign(this.state, {
           cart: cart,
        }));
    }

    private setCartVisibleState(state: boolean){
        this.setState(Object.assign(this.state, {
            cartVisible: state
        }));
    }

    private setLogginState(isLoggedIn: boolean){
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        }));

    }

    private setOrderState(orders: OrderType[]){
         this.setState(Object.assign(this.state, {
            orders: orders,
        }));
    }
    
    private hideCart(){
        this.setCartVisibleState(false);
    }

    private showCart(){
        this.setCartVisibleState(true);
    }

    componentDidMount() {
        this.getOrders();    
    }

    componentDidUpdate() {
        this.getOrders();
    }

    private getOrders(){
        api('/api/user/cart/orders/','get',{})
         .then((res: ApiResponse) => {
             const data: OrderDto[] = res.data;

             const orders: OrderType[] = data.map(order => ({
                 orderId: order.orderId,
                 status: order.status,
                 createdAt: order.createdAt,
                 cart: {
                    cartId: order.cart.cartId,
                    user: 0,
                    userId: 0,
                    createdAt: order.cart.createdAt,
                    cartArticles: order.cart.cartArticles.map ( ca => ({
                        cartArticleId: 0,
                        articleId: ca.article.articleId,
                        quantity: ca.quantity,
                        article: {
                            articleId: ca.article.articleId,
                            name: ca.article.name,
                            category: {
                                categoryId: ca.article.category.categoryId,
                                name: ca.article.category.name
                            },
                            articlePrices: ca.article.articlePrices.map(ap => ({
                                articlePriceId: 0,
                                price: ap.price,
                                createdAt: ap.createdAt,                        })), 
                        }
                    }))
                 }
             }));

             this.setOrderState(orders);
         });
    }
   //da bi nam izbacivao cenu koja je bila aktuelna u datom momentu
    private getLatestPriceBeforeDate(article: any, latestDate: any){
        const cartTimestamp = new Date(latestDate).getTime();//izvlacenje date vrednosti za latestDate
        
        let price = article.articlePrices[0];//polazna pretp - uzimamo prvu cenu

        for (let ap of article.articlePrices){//onda prolazimo kroz sve cene
            const articlePriceTimestamp = new Date(ap.createdAt).getTime();//izvlacimo za taj ap date

            if(articlePriceTimestamp < cartTimestamp){//poredimo ih 
                price = ap; //uzimamo taj ap kao trenutni price
            } else {//kada naidjemo na neki articlePT koji je u buducnosti u odnosu na cart stajemo
                break;
            }
        }
         return price;
    }

    //uzima se cena prozivoda kada je korpa napravljena a ne poslednja cena
    private calculateSum(): number{
        let sum:number = 0;

        if(this.state.cart === undefined){
            return sum;
        } else {
            for (const item of this.state.cart?.cartArticles){
                let price = this.getLatestPriceBeforeDate(item.article, this.state.cart.createdAt);
                sum+= price.price * item.quantity;
            }

            return sum;
        }
    }

    render(){
        if(this.state.isUserLoggedIn === false){
            return (
                <Redirect to="/user/login" />
            );
        }

        const sum = this.calculateSum();

        return(
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faBox} /> My Orders
                        </Card.Title>

                        <Table hover size="sm">
                            <thead>
                                <tr>
                                    <th>Created at</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.orders.map(this.printOrderRow, this)}
                            </tbody>

                        </Table>
                    </Card.Body>
                </Card>

                <Modal size="lg" centered show={ this.state.cartVisible } onHide={ ()=>this.hideCart() }>
            <Modal.Header closeButton>
                <Modal.Title>Your order details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table hover size="sm">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Article</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                       { this.state.cart?.cartArticles.map( item => {
                           const articlePrice = this.getLatestPriceBeforeDate(item.article, this.state.cart?.createdAt);
                           const price = Number(articlePrice.price).toFixed(2);
                           const total = Number(articlePrice.price * item.quantity).toFixed(2);

                           return(
                               <tr>
                                   <td>{ item.article.category.name }</td>
                                   <td>{ item.article.name }</td>
                                   <td className="text-righ">{ item.quantity}</td>
                                   <td className="text-right">{ price} EUR</td>
                                   <td className="text-right">{ total} EUR</td>
                                  
                               </tr>
                           )
                       }, this) } 
                    </tbody>
                    <tfoot>
                       <tr>
                       <td></td>
                        <td></td>
                        <td></td>
                        <td className="text-rignt">
                            <strong>Total:</strong></td>
                        <td className="text-right">{Number(sum).toFixed(2)} EUR</td>
                        </tr>
                    </tfoot>
                </Table>
            </Modal.Body>
          </Modal>
     </Container>
 );
 }
 
private setAndShowCart(cart: CartType){
    this.setCartState(cart);
    this.showCart();
} 

private printOrderRow(order: OrderType){
        return (
           <tr>
              <td>{ order.createdAt }</td>
              <td>{ order.status }</td>
              <td className="text-right">
                   <Button size="sm" variant="primary"
                           onClick={ () => this.setAndShowCart(order.cart)}>
                      <FontAwesomeIcon icon={ faBoxOpen } />
                   </Button>
              </td>
                
           </tr>
        )
    }
}