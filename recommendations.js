"use strict";

var critics = {
  'lisa': {
    'lady': 2.5,
    'snakes': 3.5,
    'luck': 3.0,
    'superman': 3.5,
    'dupree': 2.5,
    'night': 3.0
  },
  'gene': {
    'lady': 4.5,
    'snakes': 3.5,
    'luck': 4.0,
    'superman': 3.5,
    'dupree': 3.5,
    'night': 2.0
  },
  'michael': {
    'lady': 3.5,
    'snakes': 3.0,
    'luck': 4.0,
    'superman': 4.5,
    'dupree': 2.5,
    'night': 1.0
  },
  'claudia': {
    'lady': 3.5,
    'snakes': 2.5,
    'luck': 2.0,
    'superman': 2.5,
    'dupree': 3.5,
    'night': 2.0
  },
  'mick': {
    'lady': 3.5,
    'snakes': 3.5,
    'luck': 4.0,
    'superman': 2.5,
    'dupree': 3.5,
    'night': 2.0
  },
  'jack' : {
    'lady': 2.0,
    'snakes': 1.5,
    'luck': 3.0,
    'superman': 4.5,
    'dupree': 2.0,
    'night': 3.0
  }
};

//console.log(critics);
//console.log(critics.lisa.lady);
//console.log(critics.mick.snakes);
//console.log(critics.jack);


var recommend = function () {

  var distance = function (preferences, person1, person2) {
    var sharedItems = [],
        sumOfSquares = 0,
        keysP1 = Object.keys(preferences[person1]),
        keysP2 = Object.keys(preferences[person2]);

    for(var i = 0, len = keysP1.length; i < len; i++) {
      if(keysP2.indexOf(keysP1[i]) !== -1) {
        sharedItems.push(keysP1[i]);
      }
    }

    //if no items in common return 0;
    if (sharedItems.length === 0) { return 0; }

    for(i = 0, len = sharedItems.length; i < len; i++) {
      sumOfSquares += Math.pow(preferences[person1][sharedItems[i]] - preferences[person2][sharedItems[i]], 2);
    }

    return 1/(1+sumOfSquares);
  };

  var pearson = function (preferences, person1, person2) {

  };

  return {
    euclidean:euclidean,
    pearson:pearson
  };

}();


var rec = recommend;
console.log(recommend.euclidean(critics, 'lisa', 'jack'));
console.log(recommend.pearson(critics, 'lisa', 'jack'));
