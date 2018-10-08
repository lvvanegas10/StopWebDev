import {Mongo} from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Juegos } from './juegos';

export const Rooms = new Mongo.Collection('rooms');

if(Meteor.isServer){
  Meteor.publish('rooms', () =>{
    return Rooms.find({});
  });
}

Meteor.methods({
  'rooms.addRoom':function(room){
    Rooms.upsert({owner:room.owner},room);
    let newroom = Rooms.findOne({owner:room.owner});
    Meteor.users.update({username: room.owner}, {$set: {'roomId': newroom._id}});
  },
  'rooms.joinPlayer':function(username,roomId){
    let jugadores=Rooms.findOne({_id:roomId},{players:1}).players;
    if(!jugadores.includes(username)){
      jugadores.push(username);
      Rooms.update({_id:roomId},{$set:{'players':jugadores}});
      Meteor.users.update({username:username},{$set:{'roomId':roomId}});
      
      // let primeraJugada = {
      //   User: username,
      //   Nombre: {word:'',score:0},
      //   Ciudad: {word:'',score:0},
      //   Color: {word:'',score:0},
      //   Puntos: 0
      // };
      // let newPlays=Rooms.findOne({_id:roomId},{plays:1}).plays;
      // //let playIndex = newPlays.find((obj => obj.user == primeraJugada.user));
      // newPlays.push(primeraJugada);
      // Rooms.update({_id:roomId},{$set:{'plays':newPlays}});
    }},
  'rooms.changeState':function(state,roomId){
    Rooms.update({_id:roomId},{$set:{'state':state}});
  },
  'rooms.exitRoom':function(username,roomId){
    let jugadores=Rooms.findOne({_id:roomId},{players:1}).players;
    let index = jugadores.indexOf(username);
    if(index > -1){
      jugadores.splice(index,1);
    }
    let owner = Rooms.findOne({_id:roomId},{owner:1}).owner;
    if(username == owner)
    {
      if(jugadores.length>0)
      {
        let newOwner = jugadores[0];
        Rooms.update({_id:roomId},{$set:{'owner':newOwner}});
        Rooms.update({_id:roomId},{$set:{'players':jugadores}});
        Meteor.users.update({username:username},{$set:{'roomId':0}});
      }
      else{
        //delete
        Rooms.remove({owner:username});
        Meteor.users.update({username:username},{$set:{'roomId':0}});
      }
    }
  }
});