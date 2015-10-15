function fixPrioritizedStructure(creep) {
  var GAP_BEFORE_CHANGING_TARGET = 0.03; // aka 3 %

  var MIN_HITS = 1000;

  var targets = creep.room.find(FIND_STRUCTURES);
  var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

  // console.log('gps found ' + targets.length + ' structures to consider.');

  var preferredTarget = null;
  var lowestHits = 100000000000;
  var lowestHitsRatio = 100;

  // Determine preferredTarget from all Structures & construction sites
  var index = 0;

  for(var name in targets) {
    index ++;
    var target = targets[name];
    var targetRatio = calcRatio(target);

    // 1. structure with lowest hits and not at maxHits
    //    a. low health being equal go to one with smallest ticksToDecary
    // 2.
    //console.log( targetRatio + ' vs ' + lowestHitsRatio + '|' + target.hits + ' of ' + target.hitsMax);
    if(targetRatio < lowestHitsRatio && target.hits < target.hitsMax) {
      preferredTarget = target;
      lowestHits = target.hits;
      lowestHitsRatio = targetRatio;
      // lca(creep, index + ': ' + target.id + ' a ' + target.structureType + ' has ' + target.hits + ' for a ratio of ' + targetRatio + ' and is now the preferredTarget',true);
    } else {
      if(target.structureType == 'constructedWall' && target.ticksToLive > 0){
        // lca(creep, 'reviewing a constructedWall that is a newbie protective barrier, and passing on it.  TicksToLive: ' + target.ticksToLive, true);
      } else {
        //lca(creep, '[DEBUG] ' + index + ': ' + target.id + ' a ' + target.structureType + ' has ' + target.hits + ' for a ratio of ' + targetRatio + ' and is being passed over');
      }
    }
  }

  // Consider current target vs preferredTarget
  if(typeof creep.memory.currentTarget === 'undefined' ||
     creep.memory.currentTarget === null) {
    // Creep had no currentTarget - set it.
    // lca(creep, 'has a new preferredTarget:' + preferredTarget.id + ' is a ' + preferredTarget.structureType + '.');
    creep.memory.currentTarget = preferredTarget;
  } else {
    // Creep has target - decide if it should switch to preferredTarget
    // Calculate Ratios
    var ct = Game.getObjectById(creep.memory.currentTarget.id);

    var ctHitsRatio = calcRatio(ct);
    var ptHitsRatio = calcRatio(preferredTarget);

    // console.log ('[DEBUG] currentTarget Ratio: ' + ctHitsRatio + ' preferredTarget Ratio: ' + ptHitsRatio)
    // Switch from currentTarget to preferredTarget if the folowing conditions are met:
    if(ct.structureType == 'road' && ct.hits < ct.hitsMax){
      lca(creep,'road repair from: ' + nwc(ct.hits) + ' to a maxHits of: ' + nwc(ct.hitsMax) + ' at '+ ct.pos.x + ',' + ct.pos.y + ' ratio: ' + (calcRatio(ct) * 100).toFixed(2) + '%.');
    } else {
      // 1. first  clause is that pt ratio is lower than ct - GAP
      // 2. second clause is that ct has at least MIN_HITS
      // 3. third  clause is that pt has less than MIN_HITS
      if(ptHitsRatio < (ctHitsRatio - GAP_BEFORE_CHANGING_TARGET) ||
         ctHitsRatio >= MIN_HITS ||
         (preferredTarget.hits <= MIN_HITS && ct.hits >= MIN_HITS) ||
         ctHitsRatio == 1) {
         if(ct === null){
           lca(creep, 'changing focus to ' + preferredTarget.structureType + ' with Ratio of ' + ptHitsRatio);
         } else {
           lca(creep, 'changing from focusing on ' + ct.structureType + ' with Ratio of ' + ctHitsRatio + ' to ' + preferredTarget.structureType + ' with Ratio of ' + ptHitsRatio);
         }
      creep.memory.currentTarget = preferredTarget;
      }
    }
  }

  if(typeof creep.memory.currentTarget ===  'undefined' || creep.memory.currentTarget === null){
    lca(creep, 'doesn\'t have a current target.');
  } else {
    var t = Game.getObjectById(creep.memory.currentTarget.id);

    // console.log('getObjectByID for ' + creep.memory.currentTarget.id + ' returned ' + t)

    if(t) {
      if(t.structureType != 'road') {
        lca(creep,
          t.structureType + ' at ' +
          t.pos.x + ',' + t.pos.y + ' has ' +
          nwc(t.hits) + ' of ' +
          nwc(t.hitsMax) + ' hit ratio of: ' +
          (calcRatio(t) * 100).toFixed(2) + '%');
      }
      // Take Action
      // Move
      var results = creep.moveTo(t);
      if(results != OK) {
        // lca(creep, 'call to MoveTo returned: ' + displayErr(results));
      }
      // attempt repair target
      results = creep.repair(t);
      if(results != OK && results != ERR_NOT_IN_RANGE) { lca(creep, 'call to repair returned: ' + displayErr(results)); }
    } else {
      lca(creep, 'has a currentTarget that is ' + t);
    }
  }
}