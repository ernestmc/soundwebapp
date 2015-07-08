
soundState = new Mongo.Collection("soundState");


if (Meteor.isServer)
{
  // This code only runs on the server
  Meteor.startup(function() {
    // on startup, if the db is empty, fill it with initial values
    if (soundState.find().count() == 0)
    {
      soundState.insert({name:"Cow", file:"cow.mp3", checked:false, session:0});
      soundState.insert({name:"Dog", file:"dog.mp3", checked:false, session:0});
      soundState.insert({name:"Sheep", file:"sheep.mp3", checked:false, session:0});
      soundState.insert({name:"Eagle", file:"eagle.mp3", checked:false, session:0});
    }
  });
}

if (Meteor.isClient)
{
  // This code only runs on the client
  Template.body.helpers({
    soundOptions: function () {
      // get all the sounds to place the option buttons
      return soundState.find();
    }
  });
  
  // Track changes in our db
  soundState.find().observeChanges({changed: function(id){
    sound = soundState.findOne(id);
    // if a sound was selected by another session, then react playing the sound locally
    if (sound.checked && sound.session != Meteor.default_connection._lastSessionId)
      playSound(sound.name);
  }});
  
  // Attach the change event on the radio buttons
  Template.body.events({
    "change .soundOption": function(event){
      // on a change, update db with new states of the radio buttons
      updateSoundState(this._id);
    }
  });
}

// Update the soundState with current selection of radio buttons
function updateSoundState(selectedId)
{
  // uncheck the last selected one
  last = soundState.findOne({checked: true});
  if (last) soundState.update(last._id, {$set: {checked:false}});
  
  // check the newly selected one
  soundState.update(selectedId, {$set: {checked:true, session:Meteor.default_connection._lastSessionId}});
}

// Play a sound from the sound database
function playSound(soundName)
{
  // find filename associated with this sound type
  element = soundState.findOne({name: soundName});
  console.log("Playing sound: " + soundName);
  s = new buzz.sound(element.file);
  s.play();
}
