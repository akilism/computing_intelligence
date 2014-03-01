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
    'lady': 3.0,
    'snakes': 3.5,
    'luck': 1.5,
    'superman': 5.0,
    'night': 3.0,
    'dupree': 3.5
  },
  'michael': {
    'lady': 2.5,
    'snakes': 3.0,
    'superman': 3.5,
    'night': 4.0
  },
  'claudia': {
    'snakes': 3.5,
    'luck': 3.0,
    'night': 4.5,
    'superman': 4.0,
    'dupree': 2.5
  },
  'claudia1': {
    'snakes': 3.5,
    'luck': 3.0,
    'night': 4.5,
    'superman': 4.0,
    'dupree': 2.5
  },
  'mick': {
    'lady': 3.0,
    'snakes': 4.0,
    'luck': 2.0,
    'superman': 3.0,
    'night': 3.0,
    'dupree': 2.0
  },
  'jack' : {
    'lady': 3.0,
    'snakes': 4.0,
    'night': 3.0,
    'superman': 5.0,
    'dupree': 3.5
  },
  'toby' : {
    'snakes': 4.5,
    'superman': 4.0,
    'dupree': 1.0
  }
};

//console.log(critics);
//console.log(critics.lisa.lady);
//console.log(critics.mick.snakes);
//console.log(critics.jack);


var recommend = function () {

  //get the shared entries.
  var getSharedItems = function (obj, a, b) {
    var sharedItems = [],
      keysP1 = Object.keys(obj[a]),
      keysP2 = Object.keys(obj[b]);

    for(var i = 0, len = keysP1.length; i < len; i++) {
      if(keysP2.indexOf(keysP1[i]) !== -1) {
        sharedItems.push(keysP1[i]);
      }
    }

    return sharedItems;
  };

  //sum all of an objects keys.
  var getSum = function(obj, key) {
    var sum = 0,
      arr = [];

    for (var k in obj[key]) {
      if(obj[key].hasOwnProperty(k)) {
        arr.push(obj[key][k]);
      }
    }

    sum = arr.reduce(function (prevVal, currentVal) {
      return prevVal + currentVal;
    });

    return sum;
  };

  //calculate sums, square sums, product sum.
  var getSums = function (preferences, person1, person2, sharedItems) {
    var sums = {
      'sum1': 0,
      'sum2': 0,
      'sum1Sq': 0,
      'sum2Sq': 0,
      'prdtSum': 0
    };

    for(var i = 0, len = sharedItems.length; i < len; i++) {
      sums.sum1 += preferences[person1][sharedItems[i]];
      sums.sum2 += preferences[person2][sharedItems[i]];
      sums.sum1Sq += Math.pow(preferences[person1][sharedItems[i]], 2);
      sums.sum2Sq += Math.pow(preferences[person2][sharedItems[i]], 2);
      sums.prdtSum += preferences[person1][sharedItems[i]] * preferences[person2][sharedItems[i]];
    }

    return sums;
  };

  //calculate the euclidean distance.
  var euclidean = function (preferences, person1, person2) {
    var sharedItems = getSharedItems(preferences, person1, person2),
      sumOfSquares = 0;

    //if no items in common return 0;
    if (sharedItems.length === 0) { return 0; }

    for(var i = 0, len = sharedItems.length; i < len; i++) {
      sumOfSquares += Math.pow(preferences[person1][sharedItems[i]] - preferences[person2][sharedItems[i]], 2);
    }

    return 1/(1+sumOfSquares);
  };

  //calculate the pearson correlation score.
  var pearson = function (preferences, person1, person2) {
    var sharedItems = getSharedItems(preferences, person1, person2),
      n = sharedItems.length,
      num, den;

    //nothing common between the two.
    if (n === 0) { return 0; }

    var sums = getSums(preferences, person1, person2, sharedItems);

    //calculate pearson correlation.
    num = sums.prdtSum-(sums.sum1*sums.sum2/n);
    den = Math.sqrt((sums.sum1Sq - Math.pow(sums.sum1, 2)/n)*(sums.sum2Sq - Math.pow(sums.sum2, 2)/n));
    if (den === 0) { return 0; }
    return num/den;
  };


  var topMatches = function (preferences, person, n, similarity) {
    var scores = [];

    for (var other in preferences) {
      if(preferences.hasOwnProperty(other) && other !== person) {
        scores.push([similarity(preferences, person, other), other]);
      }
    }

    scores.sort(function (a, b) {
      if (a[0] > b[0]) { return 1; }
      if (a[0] < b[0]) { return -1; }
      return 0;
    });

    scores.reverse();
    return scores.slice(0, n);
  };

  return {
    euclidean:euclidean,
    pearson:pearson,
    topMatches:topMatches
  };

}();


var rec = recommend;
//console.log('euclidean    :   ' + rec.euclidean(critics, 'lisa', 'gene'));
//console.log('pearson      :   ' + rec.pearson(critics, 'lisa', 'gene'));
console.log('top matches  : \n', rec.topMatches(critics, 'claudia1', 5, rec.pearson));
