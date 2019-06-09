(function() {

window.galaxysim.PointMassBody = PointMassBody;

function PointMassBody(mass, position, velocity) {
    this.mass = mass;
    this.invMass = 1.0 / mass;
    this.position = position;
    this.velocity = velocity;
    this.force = new THREE.Vector3(0,0,0);
    this.prevForce = new THREE.Vector3(0,0,0);
}
PointMassBody.prototype = Object.create(Object.prototype);

PointMassBody.verletPositionStep = function(bodies, dt) {
    var velocityishX = 0.0, velocityishY = 0.0, velocityishZ = 0.0;
    for(var i=0, len=bodies.length; i<len; i++) {
        var body = bodies[i];
        var accelerationFactor = body.invMass * dt * 0.5;
        var position = body.position;
        var velocity = body.velocity;
        var force = body.force;
        var prevForce = body.prevForce;

        velocityishX = velocity.x;
        velocityishY = velocity.y;
        velocityishZ = velocity.z;

        velocityishX += force.x*accelerationFactor;
        velocityishY += force.y*accelerationFactor;
        velocityishZ += force.z*accelerationFactor;

        position.x += velocityishX*dt;
        position.y += velocityishY*dt;
        position.z += velocityishZ*dt;

        prevForce.x = force.x;
        prevForce.y = force.y;
        prevForce.z = force.z;
    }
};

PointMassBody.verletAccelerationStep = function(bodies, dt) {
    for(var i=0, len=bodies.length; i<len; i++) {
        var body = bodies[i];
        var force = body.force;
        var velocity = body.velocity;
        var prevForce = body.prevForce;
        var accelerationFactor = body.invMass * dt * 0.5;

        velocity.x += (force.x+prevForce.x)*accelerationFactor;
        velocity.y += (force.y+prevForce.y)*accelerationFactor;
        velocity.z += (force.z+prevForce.z)*accelerationFactor;

        prevForce.x = force.x;
        prevForce.y = force.y;
        prevForce.z = force.z;

        force.x = force.y = force.z = 0.0;
    }
};


PointMassBody.velocityVerletUpdate = function(bodies, dt, isPositionStep) {
    if(isPositionStep) {
        PointMassBody.verletPositionStep(bodies, dt);
    } else {
        PointMassBody.verletAccelerationStep(bodies, dt);
    }
};


galaxysim.createTwoTierSmartGravityApplicator = function(attractedCelestials, 
    attractingCelestials) {
    var applicator = {};
    var attractingIsAttracted = attractingCelestials === attractedCelestials;
    var pairForces = _.map(attractedCelestials, function() { 
        return new THREE.Vector3(0, 0, 0); 
    });
    var currentFarAttractedIndex = 0;

    applicator.applyPairForces = function() {
        for(var i=0, len=attractedCelestials.length; i<len; i++) {
            attractedCelestials[i].force.add(pairForces[i]);
        }
    }


    applicator.handleBlackHoles = function() {
      var typicalStarMass = galaxysim.TYPICAL_STAR_MASS;
      var universeScaleRecipr = galaxysim.UNIVERSE_SCALE_RECIPROCAL;
      var gravitationalConstant = galaxysim.GRAVITATIONAL_CONSTANT;
      var gravityEpsilon = galaxysim.GRAVITY_EPSILON;
      var gravityEpsilonSqrd = gravityEpsilon*gravityEpsilon;

      var sqrDist = 0.0, force;
      var temp_force = new THREE.Vector3(0,0,0); // To avoid allocations during updates
      var DARK_FORCE_COEFFICIENT = 4*Math.pow(10, -20) * gravitationalConstant;
      for (var i = 0, len=attractedCelestials.length; i<len; i ++ ){
        for (var j = 0; j < galaxysim.NUMBLACKHOLES; j ++ ){
          if (attractingIsAttracted && i == j) {
              continue;
          }

          var body1 = attractedCelestials[i];
          var body2 = attractingCelestials[j];

          var body1pos = body1.position;
          var body2pos = body2.position;

          var sqrDist = body1pos.distanceToSquared(body2pos) 
              * universeScaleRecipr * universeScaleRecipr;
          var dist =  Math.sqrt(sqrDist);
          force = galaxysim.GRAVITATIONAL_CONSTANT * body1.mass * body2.mass / 
              Math.pow(sqrDist + gravityEpsilonSqrd, 3/2);

          force += DARK_FORCE_COEFFICIENT * (body1.mass * body2.mass / dist);

          var bodyforce = body1.force;
          temp_force.subVectors(body2.position, body1.position).normalize().multiplyScalar(force);
          bodyforce.add(temp_force);
        }
      }

    };

    applicator.handlePairForces = function(bodyCountToUpdatePairForcesFor){
      var typicalStarMass = galaxysim.TYPICAL_STAR_MASS;
      var universeScaleRecipr = galaxysim.UNIVERSE_SCALE_RECIPROCAL;
      var gravitationalConstant = galaxysim.GRAVITATIONAL_CONSTANT;
      var gravityEpsilon = galaxysim.GRAVITY_EPSILON;
      var gravityEpsilonSqrd = gravityEpsilon*gravityEpsilon;

      var body1To2X = 0.0, body1To2Y = 0.0; body1To2Z = 0.0;

      var attractedCount = attractedCelestials.length;
      var sqrDist = 0.0, force = 0.0;
      var temp_force = new THREE.Vector3(0,0,0); // To avoid allocations during updates

      for(var n=0; n<bodyCountToUpdatePairForcesFor; n++) {
          currentFarAttractedIndex++;
          if(currentFarAttractedIndex >= attractedCount) {
              currentFarAttractedIndex = 0;
          }
          var body1 = attractedCelestials[currentFarAttractedIndex];

          var farForce = pairForces[currentFarAttractedIndex];
          farForce.set(0,0,0);
          var attractedBody = attractedCelestials[currentFarAttractedIndex];

          for(var j=galaxysim.NUMBLACKHOLES; j<galaxysim.BODYCOUNT; j++) {
              if(attractingIsAttracted && j == currentFarAttractedIndex) {
                continue;
              }
              temp_force.set(0,0,0);
              var body2 = attractingCelestials[j];

              var sqrDist = body1.position.distanceToSquared(body2.position) * 
                  universeScaleRecipr * universeScaleRecipr;
              force = galaxysim.GRAVITATIONAL_CONSTANT * body1.mass * body2.mass / 
                  Math.pow(sqrDist + gravityEpsilonSqrd, 3/2);
              temp_force.subVectors(body2.position, body1.position).normalize()
                  .multiplyScalar(force);
              farForce.add(temp_force);

          }
          pairForces[currentFarAttractedIndex] = farForce;
        }
    };

    applicator.updateForces = function(bodyCountToUpdatePairForcesFor) {
        applicator.handleBlackHoles();
        applicator.handlePairForces(bodyCountToUpdatePairForcesFor);
        applicator.applyPairForces();
    };
    return applicator;
}


galaxysim.createGravitySystem = function(particleCount, typicalMass, numblackholes, blackholepos) {
    var bodies = [];

    var typicalStarSpeed = 0.8 * 7*Math.pow(10, 10) * galaxysim.UNIVERSE_SCALE;
    var side = 4300.0;

    var BLACK_HOLE_MASS = galaxysim.TYPICAL_STAR_MASS * 7000;

    for (var p = 0; p < particleCount; p++) {
        var angle = Math.PI * 2 * Math.random();

        // This creates density variations angularly
        angle += 0.10 * Math.sin(angle * Math.PI*2);

        if(p < numblackholes) {
          var mass = BLACK_HOLE_MASS;
          //start blackholes at some random positions
          if (numblackholes === 1) {
            var pX = 0;
            var pY = 0;
            var pZ = 0;
          } else {
            var dist = side * 8 * Math.random();
            var pX = dist * Math.random()  - dist *0.5;
            var pY = 0;
            var pZ =  dist * Math.random()  - dist * 0.5 ;
          }

          var body = new PointMassBody(mass, new THREE.Vector3(pX, pY, pZ), 
              new THREE.Vector3(0, 0, 0));

        } else {
          var dist = side * 0.5 * Math.random();
          dist += side * 0.04 * -Math.cos(angle * Math.PI*2);

          var mass = typicalMass * 2 * Math.random() * Math.random();

          var pX = dist * Math.cos(angle);
          var pY = (Math.random() - 0.5) * (side - dist) * 0.7;
          var pZ = dist * Math.sin(angle);
          if (numblackholes > 0) {
            var closest_bh = Math.floor(Math.random() * (galaxysim.NUMBLACKHOLES));
            var bh_pos = bodies[closest_bh].position;
          } else {
            var closest_bh = Math.floor(Math.random() * (galaxysim.NUMBLACKHOLES));
            var bh_pos = blackholepos[closest_bh];
          }

          var vel = new THREE.Vector3(pX, pY, pZ);
          vel.normalize();
          var requiredSpeed = typicalStarSpeed * 1.8 + typicalStarSpeed * 
              0.1 * Math.log(1.1+(10*dist/side));

          var xVel = vel.z * requiredSpeed;
          var yVel = vel.y * requiredSpeed;
          var zVel = -vel.x * requiredSpeed;

          var vel2 = new THREE.Vector3(xVel, yVel, zVel);

          var pos = new THREE.Vector3(pX + bh_pos.x, pY +bh_pos.y, pZ + bh_pos.z);
          var body = new PointMassBody(mass, pos, vel2);
        }
      bodies.push(body);

    }
    return bodies;
};


})();
