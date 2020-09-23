{
  const inputRef = document.getElementById('search');
  const textRef = document.getElementById('searchable');

  let sourceText = textRef.innerHTML;
  
  inputRef.focus();
  inputRef.addEventListener('keyup', handleSearchChange);
  textRef.addEventListener('keyup', () => {
    sourceText = document.getElementById('searchable').innerHTML;
  });

  let searchDebounce = null;
  function handleSearchChange(event) {
    const val = event.target.value || '';

    // Making debounce because in real apps this search might be fetched
    // from an API and we don't want to make a fetch call for every single
    // letter, but only when the user stopped to search.
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(highlight, 300, val);
  }

  function highlight(val) {
    let processedVal = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let regex = new RegExp(processedVal, 'g');

    if(processedVal.length)
      textRef.innerHTML = sourceText.replace(regex, '<mark>$&</mark>');
    else
      textRef.innerHTML = sourceText;
  }
}