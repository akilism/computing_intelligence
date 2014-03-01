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
  },
  'akil' : {
    'lady': 3.0,
    'snakes': 4.0
  }
};

var recommend = function () {

  //get the shared entries.
  var getSharedItems = function (obj, a, b) {
    debugger;
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
    var sum,
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

  //transform the data.
  var transformPrefs = function (preferences) {
    var result = {};

    for (var p in preferences) {
      if (preferences.hasOwnProperty(p)) {
        for (var i in preferences[p]) {
          if (preferences[p].hasOwnProperty(i)) {
            if(result.hasOwnProperty(i)) {
              result[i][p] = preferences[p][i];
            } else {
              result[i] = {};
              result[i][p] =  preferences[p][i];
            }
          }
        }
      }
    }
    return result;
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

  //get the top n matches
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

  //get recommendations
  var getRecommendations = function (preferences, person, similarity) {
    var totals = {},
        simSums = {},
        rankings = [],
        sim;

    for(var other in preferences) {
      //if this is the person we are recommending for return.
      if(other === person) { continue; }
      if(preferences.hasOwnProperty(other)) {
        sim = similarity(preferences, person, other);

        //no similarity then return.
        if (sim === 0) { continue; }

        for(var k in preferences[other]) {
          if(preferences[other].hasOwnProperty(k)) {
            //only look at things that don't exist in person.
            if (Object.keys(preferences[person]).indexOf(k) === -1 || preferences[person][k] === 0) {
              if(totals.hasOwnProperty(k)) {
                totals[k] += preferences[other][k]*sim;
              } else {
                totals[k] = preferences[other][k]*sim;
              }

              if(simSums.hasOwnProperty(k)) {
                simSums += sim;
              } else {
                simSums = sim;
              }
            }
          }
        }
      }
    }

    //calculate rankings.
    for(var i in totals) {
      if(totals.hasOwnProperty(i)) {
        var ranked = {};
        ranked[i] = totals[i];
        rankings.push(ranked);
      }
    }

    rankings.sort();
    rankings.reverse();
    return rankings;




  };

  //item based filtering.
  var calculateSimilarItems = function (preferences, n) {
    var result = {},
      itemPrefs = transformPrefs(preferences),
      c = 0,
      scores;

    for(var i in itemPrefs) {
      if(itemPrefs.hasOwnProperty(i)) {
        c++;
        if (c % 100 === 0) { console.log(c + ' / ' + itemPrefs.length); }
        scores = topMatches(itemPrefs, i, n, euclidean);
        result[i] = scores;
      }
    }

    return result;
  };

  return {
    euclidean:euclidean,
    pearson:pearson,
    topMatches:topMatches,
    getRecommendations:getRecommendations,
    transformPrefs:transformPrefs,
    calculateSimilarItems:calculateSimilarItems
  };

}();

console.log('critics      : ');
console.log('euclidean    :   ' + recommend.euclidean(critics, 'lisa', 'gene'));
console.log('pearson      :   ' + recommend.pearson(critics, 'lisa', 'gene'));
console.log('top matches  : \n', recommend.topMatches(critics, 'toby', 5, recommend.euclidean));
console.log('recommendations  : \n', recommend.getRecommendations(critics, 'akil', recommend.pearson));

var movies = recommend.transformPrefs(critics);
console.log('movies       :');
console.log('euclidean    :   ' + recommend.euclidean(movies, 'superman', 'snakes'));
console.log('pearson      :   ' + recommend.pearson(movies, 'night', 'lady'));
console.log('top matches  : \n', recommend.topMatches(movies, 'superman', 5, recommend.euclidean));
console.log('recommendations  : \n', recommend.getRecommendations(movies, 'lady', recommend.pearson));

console.log(recommend.calculateSimilarItems(critics, 10));