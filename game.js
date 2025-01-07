let TIME_LIMIT = 60;

let quotes_array = [
  'Push yourself, because no one else is going to do it for you.',
  'Failure is the condiment that gives success its flavor.',
  'Wake up with determination. Go to bed with satisfaction.',
  "It's going to be hard, but hard does not mean impossible.",
  'Learning never exhausts the mind.',
  'The only way to do great work is to love what you do.',
];

let timer_text = document.querySelector('.curr_time');
let accuracy_text = document.querySelector('.curr_accuracy');
let error_text = document.querySelector('.curr_errors');
let cpm_text = document.querySelector('.curr_cpm');
let wpm_text = document.querySelector('.curr_wpm');
let quote_text = document.querySelector('.quote');
let input_area = document.querySelector('.input_area');
let restart_btn = document.querySelector('.restart_btn');
let cpm_group = document.querySelector('.cpm');
let wpm_group = document.querySelector('.wpm');
let error_group = document.querySelector('.errors');
let accuracy_group = document.querySelector('.accuracy');

let timeLeft = TIME_LIMIT;
let timeElapsed = 0;
let total_errors = 0;
let errors = 0;
let accuracy = 0;
let characterTyped = 0;
let current_quote = '';
let quoteNo = 0;
let timer = null;

// Keeps track of current word being typed
let currentWordIndex = 0;

const updateQuote = () => {
  quote_text.textContent = null;
  current_quote = quotes_array[quoteNo];

  // Separate each word and style them
  current_quote.split(' ').forEach((word) => {
    const wordSpan = document.createElement('span');
    wordSpan.classList.add('word');
    wordSpan.innerText = word + ' '; // Add space between words
    quote_text.appendChild(wordSpan);
  });

  // Reset word index
  currentWordIndex = 0;

  // Roll over to the first quote
  if (quoteNo < quotes_array.length - 1) quoteNo++;
  else quoteNo = 0;
};

const processCurrentText = () => {
  let curr_input = input_area.value.trim(); // Get the trimmed input text
  let inputWords = curr_input.split(' '); // Split input into words
  let quoteWords = current_quote.split(' '); // Split the quote into words

  errors = 0;

  // Get all word spans
  let wordSpanArray = quote_text.querySelectorAll('.word');

  // Process all words in the quote
  wordSpanArray.forEach((wordSpan, index) => {
    let typedWord = inputWords[index] || ''; // Get the word typed by the user

    if (index < currentWordIndex) {
      // Previous words
      if (typedWord === quoteWords[index]) {
        wordSpan.classList.add('correct_word');
        wordSpan.classList.remove('incorrect_word');
      } else {
        wordSpan.classList.add('incorrect_word');
        wordSpan.classList.remove('correct_word');
        errors++;
      }
    } else if (index === currentWordIndex) {
      // Current word being typed
      if (quoteWords[index].startsWith(typedWord)) {
        // Partially correct word
        wordSpan.classList.remove('incorrect_word');
      } else {
        wordSpan.classList.add('incorrect_word');
        errors++;
      }
    } else {
      // Future words
      wordSpan.classList.remove('correct_word', 'incorrect_word');
    }
  });

  // Update error count
  error_text.textContent = total_errors + errors;

  // Update accuracy
  let correctCharacters = characterTyped - (total_errors + errors);
  let accuracyVal = (correctCharacters / characterTyped) * 100;
  accuracy_text.textContent = Math.round(accuracyVal);

  // If the current word is fully typed and correct
  if (
    inputWords[currentWordIndex] === quoteWords[currentWordIndex] &&
    curr_input.endsWith(' ')
  ) {
    currentWordIndex++; // Move to the next word
    input_area.value = ''; // Clear the input area

    // If the last word is typed, load the next quote
    if (currentWordIndex === quoteWords.length) {
      updateQuote();
      total_errors += errors; // Update total errors
      input_area.value = ''; // Clear input field
    }
  }

  // Increment total characters typed
  characterTyped++;
};
