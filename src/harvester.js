function harvest(creep, source) {
  var busy = 0;
  var STORAGE_LIMIT = 200000;

  if(creep.spawning === true) {
    lca(creep, 'is still spawning.');
    return 0;
  }
  var drops = creep.room.find(FIND_DROPPED_ENERGY);
  var targets = null;

  if(drops > 0){
    lca(creep,'dropped energies available: ' + drops.length);
  }

  if(creep.carry.energy === 0 || (creep.memory.state == 'gathering' && creep.carry.energy < creep.carryCapacity)) {
    lca(creep, 'is gathering energy: ' + creep.carry.energy + ' of ' + creep.carryCapacity + '.');
    creep.moveTo(source);
    if(drops.length > 0) {
      pickupEnergy(creep,drops);
    }
    creep.harvest(source);
    creep.memory.state = 'gathering';
  } else {
    creep.memory.state = 'transferring';
    if(Game.spawns.Spawn1.energy == Game.spawns.Spawn1.energyCapacity) {
      // lca(creep, 'observed that the spawn energy level is at capacity.', true);
      // lca(creep, 'has ' + creep.carry.energy + ' energy.',true);
      if(creep.carry.energy > 0) {
        targets = p_room.find(FIND_MY_STRUCTURES);
        //console.log(creep.name + ' says there are ' + targets.length + ' structures, looking for STRUCTURE_EXTENSION');
        for(var index in targets) {
          var target = targets[index];
          //console.log(creep.name + ' is evaluating ' + index + ' - structure type is: ' + target.structureType);
          if(target.structureType == STRUCTURE_EXTENSION && busy === 0) {
            if(target.energy < target.energyCapacity) {
              lca(creep, 'is taking energy to a (' + target.structureType + ' - ' + target.pos.x +',' + target.pos.y + ' it is at ' + target.energy + ' of ' + target.energyCapacity + ').');
              creep.moveTo(target);
              creep.transferEnergy(target);
              busy = 1;
            }
          } else if(target.structureType == STRUCTURE_STORAGE && busy === 0) {
            if(target.energy < STORAGE_LIMIT) {
              lca(creep, 'is taking energy to storage (' + target.energy + ' of ' + STORAGE_LIMIT + ' max: ' + target.energyCapacity + ').');
              creep.moveTo(creep.room.storage);
              creep.transferEnergy(creep.room.storage);
              busy = 1;
            }
          }
        }
      }
      if(busy === 0 && (typeof creep.memory.locked === 'undefined' || creep.memory.locked === false)) {
        creep.memory.role = 'upgrade';
        console.log(creep.name + ' is now in \'upgrade\' mode.');
      }
    } else {
      lca(creep, 'is taking energy to spawn: ' + creep.carry.energy + ' of ' + creep.carryCapacity + '.');
      creep.moveTo(Game.spawns.Spawn1);
      creep.transferEnergy(Game.spawns.Spawn1);
    }
  }
}