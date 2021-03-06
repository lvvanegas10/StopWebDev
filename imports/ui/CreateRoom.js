import React, { Component } from 'react';
import {Card, CardTitle, CardText, Button, Input, Container, Row, Col} from 'reactstrap';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import {withTracker} from 'meteor/react-meteor-data';
import Room from './Room';

class CreateRoom extends Component {
  constructor(props){
    super(props);

    this.state={
      idJoin:''
    };

    this.handleCreate = this.handleCreate.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
  }

  handleInput(event){
    const value = event.target.value;
    this.setState({
      [event.target.name]: value
    });
  }

  handleJoin(){
    if(this.state.idJoin!=''){
      Meteor.call('rooms.joinPlayer',this.props.user.username,this.state.idJoin);
    }
    else{
      alert('introduce un id');
    }
  }

  generarLetra(){
    let alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alfabeto.charAt(Math.floor(Math.random()*alfabeto.length));
  }

  handleCreate(){
    let room = {
      letra:this.generarLetra(),
      owner:this.props.user.username,
      pass:'',
      state:'Esperando jugadores',
      players:[this.props.user.username]
    };

    Meteor.call('rooms.addRoom',room);
  }

  render() {
    if(Meteor.user()){
      console.log(this.props.user.roomId);
    }
    return (
      <div>
        {Meteor.user() ?
          this.props.user.roomId==0?
            <Container>
              <Row>
                <Col sm="6">
                  <Card body>
                    <CardTitle>Crear nueva sala</CardTitle>
                    <CardText>Podras crear una sala con contraseña para invitar solo a tus amigos o abierta para cualquiera.</CardText>
                    <Button onClick={this.handleCreate}>Crear</Button>
                  </Card>
                </Col>
                <Col sm="6">
                  <Card body>
                    <CardTitle>Unirse a una sala</CardTitle>
                    <CardText>Introduce el id de la sala para entrar</CardText>
                    <Input value={this.state.idJoin} onChange={this.handleInput} name='idJoin' type="text"></Input>
                    <Button onClick={this.handleJoin}>Unirse</Button>
                  </Card>
                </Col>
              </Row>
            </Container>
            : 
            <Room user={this.props.user}/>
          : <h3>Debes iniciar sesion para jugar</h3> 
        }
      </div>
    );
  }
}

CreateRoom.propTypes = {
  user: PropTypes.object
};

export default withTracker(() => {
  Meteor.subscribe('userData');
  Meteor.subscribe('rooms');
  return {
    user: Meteor.user()
  };
})(CreateRoom);