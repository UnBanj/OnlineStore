import React from "react";
import { Nav } from "react-bootstrap";

export class MainMenuItem {
    text: string = '';
    link: string= '#';

    constructor(text: string, link: string){
        this.text= text;
        this.link = link;
    }
}

interface MainMenuProperties {
    items: MainMenuItem[];
}

interface MainMenuState {
    items: MainMenuItem[];
}

export class MainMenu extends React.Component<MainMenuProperties> {
   state: MainMenuState;

   constructor(props: Readonly<MainMenuProperties>) {
       super(props);

       this.state = {
          items: props.items,
       };
   }

   setItems(items: MainMenuItem[]){
       this.setState({
           items: items,
       });
   }

    render(){
        return (
           <Nav variant="tabs">
             { this.state.items.map(this.makeNavLink) }
            </Nav>
        );   
    }
    //uzima 1 item i vraca reprezentaciju tog itema u obliku html koda
    private makeNavLink(item: MainMenuItem){
        return (
            <Nav.Link href= {item.link}>
                {item.text}
            </Nav.Link>
        );
    }
}