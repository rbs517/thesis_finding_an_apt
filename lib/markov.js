// Char-level and Word-level Markov implementation 
// A slightly modified version of Daniel Shiffman's markov implementation so it can be used without p5.js by Todd Anderson
// Original example taken from https://github.com/shiffman/A2Z-F15
// Dan's work is based on Allison Parrish's  RWET examples
// https://github.com/aparrish/rwet-examples
//Comments below are mostly Dan's, occasionally Todd's:

// Prototype is magic!  By accessing Array.prototype
// we can augment every single Array object with an new function

// Like python's choice this will return a 
// random element from an array
Array.prototype.choice = function() {
  var i = Math.floor(Math.random()*this.length);
  return this[i];
}
String.prototype.tokenize = function() {
  return this.split(/\s+/);
}
String.prototype.regexLastIndexOf = function(regex, startpos) {
    regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : ""));
    if(typeof (startpos) == "undefined") {
        startpos = this.length;
    } else if(startpos < 0) {
        startpos = 0;
    }
    var stringToWorkWith = this.substring(0, startpos + 1);
    var lastIndexOf = -1;
    var nextStop = 0;
    while((result = regex.exec(stringToWorkWith)) != null) {
        lastIndexOf = result.index;
        regex.lastIndex = ++nextStop;
    }
    return lastIndexOf;
}
// An object that generates text with markov-chains at the character level
function MarkovGenerator(n, max, separator="\n", trim=false) {
  // Order (or length) of each ngram
  this.n = n;
  // What is the maximum amount we will generate?
  this.max = max;
  // An object as dictionary
  // each ngram is the key, a list of possible next elements are the values
  this.ngrams = {};
  // A separate array of possible beginnings to generated text
  this.beginnings = [];

  // A function to feed in text to the markov chain
  this.feed = function(text) {

    // Discard this line if it's too short
    if (text.length < this.n) {
      return false;
    }

    // Store the first ngram of this line
    var splitText = text.split(separator)
    for (var i = splitText.length - 1; i >= 0; i--) {
      var beginning = splitText[i].substring(0, this.n);
      this.beginnings.push(beginning);
    }

    // var beginning = text.substring(0, this.n);
    
    // Now let's go through everything and create the dictionary
    for (var i = 0; i < text.length - this.n; i++) {
      var gram = text.substring(i, i + this.n);
      var next = text.charAt(i + this.n);
      // Is this a new one?
      if (!this.ngrams.hasOwnProperty(gram)) {
        this.ngrams[gram] = [];
      }
      // Add to the list
      this.ngrams[gram].push(next);
    }
  }

  // Generate a text from the information ngrams
  this.generate = function() {

    // Get a random  beginning 
    var current = this.beginnings.choice();
    var output = current;
    
    // Generate a new token max number of times
    for (var i = 0; i < this.max; i++) {
      // If this is a valid ngram
      if (this.ngrams.hasOwnProperty(current)) {
        // What are all the possible next tokens
        var possible_next = this.ngrams[current];
        // Pick one randomly
        var next = possible_next.choice();
        // Add to the output
        output += next;
        // Get the last N entries of the output; we'll use this to look up
        // an ngram in the next iteration of the loop
        current = output.substring(output.length - this.n, output.length);
      } else {
        break;
      }
    }
    // Here's what we got!
    if(trim){
      output = output.substring(0,output.regexLastIndexOf(/[!.?]/)+1)
    }
    return output;
  }
}

//Same as above, but working at the word level rather than the character level
function MarkovGeneratorWord(n, max, trim=true,separator=/[!.?]/) {
  // Order (or length) of each ngram
  this.n = n;
  // What is the maximum amount we will generate?
  this.max = max;
  // An object as dictionary
  // each ngram is the key, a list of possible next elements are the values
  this.ngrams = {};
  // A separate array of possible beginnings to generated text
  this.beginnings = [];

  // A function to feed in text to the markov chain
  this.feed = function(text) {
    var tokens = text.tokenize();

    // Discard this line if it's too short
    if (tokens.length < this.n) {
      return false;
    }

    // Store the first ngram of this line
    // var beginning = tokens.slice(0, this.n).join(' ');
    // this.beginnings.push(beginning);
    var nextIsBeginning = true
      // Now let's go through everything and create the dictionary
    for (var i = 0; i < tokens.length - this.n; i++) {
      // Usings slice to pull out N elements from the array
      gram = tokens.slice(i, i + this.n).join(' ');
      if(nextIsBeginning){this.beginnings.push(gram); nextIsBeginning = false}
      if(tokens[i].regexLastIndexOf(/[!.?]/) == tokens[i].length-1){nextIsBeginning = true}
      // What's the next element in the array?
      next = tokens[i + this.n];

      // Is this a new one?
      if (!this.ngrams[gram]) {
        this.ngrams[gram] = [];
      }
      // Add to the list
      this.ngrams[gram].push(next);
    }
  }

  // Generate a text from the information ngrams
  this.generate = function() {

    // Get a random beginning 
    var current = this.beginnings.choice();

    // The output is now an array of tokens that we'll join later
    var output = current.tokenize();

    
    // Generate a new token max number of times
    for (var i = 0; i < this.max; i++) {
      // If this is a valid ngram
      if (this.ngrams[current]) {
        // What are all the possible next tokens
        var possible_next = this.ngrams[current];
        // Pick one randomly
        var next = possible_next.choice();
        // Add to the output
        output.push(next);
        // Get the last N entries of the output; we'll use this to look up
        // an ngram in the next iteration of the loop
        current = output.slice(output.length - this.n, output.length).join(' ');
      } else {
        break;
      }
    }
    // Here's what we got!
    output = output.join(' ');
    if(output.regexLastIndexOf(/[.!?\"]/) > 0){
      return output.substring(0,output.regexLastIndexOf(/[.!?\"]/)+1)
    } else{
      return output
    }
  }
}