function storageReport(room) {
  var upDown = '';

  if(typeof room.storage !== 'undefined'){

    if(typeof room.memory.lastRoundStoredEnergy === 'undefined'){
      room.memory.lastRoundStoredEnergy = room.storage.store.energy;
      room.memory.lastRoundTicks = Game.time;
    } else {
      room.memory.lastRoundStoredEnergy = room.storage.store.energy;
      room.memory.lastRountTicks = Game.time;
    }


    var lastRound = room.memory.lastRoundStoredEnergy;
    var diff = room.storage.store.energy - lastRound;

    if(diff === 0){
      upDown = 'stayed the same';
    } else if(diff > 0) {
      upDown = 'gone up';
    } else {
      upDown = 'gone down';
    }

    console.log('Storage Report: ' + nwc(room.storage.store.energy) + ' has ' + upDown + ' by ' + nwc(Math.abs(diff)) + ' since the benchmark was set.');
  }
}