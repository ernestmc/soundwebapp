
soundState = new Mongo.Collection("soundState");

if (Meteor.isServer)
{
  // This code only runs on the server
  Meteor.startup(function() {
    // on startup, if the db is empty, fill it with initial values
    if (soundState.find().count() == 0)
    {
      soundState.insert({name:"Cow", file:"cow.mp3", checked:false});
      soundState.insert({name:"Dog", file:"dog.mp3", checked:false});
    }
  });
}

if (Meteor.isClient)
{
  // This code only runs on the client
  Template.body.helpers({
    soundOptions: function () {
      return soundState.find();
    }
  });

  // Attach the click event on the radio buttons
  Template.body.events({
    "click .soundOption": function (event) {
      maskSound = true;
      soundName = event.target.value;
      playSound(soundName);
    },
    "change .soundOption": function(event){
      console.log("Changed!");
        
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
  soundState.update(selectedId, {$set: {checked:true}});
}

// Play a sound from the sound database
function playSound(soundName)
{
  // find filename associated with this sound type
  element = soundState.findOne({name: soundName});
  console.log("Playing sound...");
  s = new buzz.sound(element.file);
  s.play();
}
