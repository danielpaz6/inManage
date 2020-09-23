{
  // Configurations and global variables.

  /** 
   * The reason I chose to put the svg in the JS file and not as SVG file
   * is because otherwise we couldn't manipulate and change the style of the SVG
   * More details can be found here:
   * https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Adding_vector_graphics_to_the_Web
  */
  const shapeList = {
    square: {
      className: 'square',
      html: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" /></svg>',
      minSize: 50,
      maxSize: 200,
    },
    circle: {
      className: 'circle',
      html: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50%" cy="50%" r="50%" /></svg>',
      minSize: 50,
      maxSize: 400,
    },
    triangle: {
      className: 'triangle',
      html: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="0,100 50,0 100,100" /></svg>',
      minSize: 50,
      maxSize: 150,
    },
  };
  let shapeCount = 0;
  let isActiveShape = false;

  // Listeners
  document.getElementById('addBtn').addEventListener('click', handleAddShape);
  document.getElementById('removeShape').addEventListener('click',
    handleRemoveShape);
  document.getElementById('rotateShape').addEventListener('click',
    handleRotateShape);
  document.getElementById('shapePanel').addEventListener('focusout',
    handleFocusOutPanel);

  // References
  const panelRef = document.getElementById('shapePanel');

  // Functions
  function handleAddShape(event) {
    event.stopPropagation();

    const randomShapeRef = getRandomShape();
    const [r, g, b] = [getRandomInt(256), getRandomInt(256), getRandomInt(256)];
    const size = getRandomIntRange(randomShapeRef.minSize,
        randomShapeRef.maxSize);
    const leftPos = getRandomInt(100); // in percents
    const topPos = getRandomInt(100); // in percents

    const node = document.createElement('div');
    node.className = `shape ${randomShapeRef.className}`;
    node.innerHTML = randomShapeRef.html;
    node.style.fill = `rgb(${r}, ${g}, ${b})`;
    node.style.width = `${size}px`;
    node.style.height = `${size}px`;

    // '.shape' class has transition, so in order to see the animation
    // we'll add style after the node will already be rendered in the DOM.
    setTimeout(() => {
      // We want our app to be compitable for all resolutions
      // so we'll make a limit for random position according to user's screen.
      // clamp is great function that let us define size that is blocked by
      // min and max values
      node.style.top = `clamp(100px, ${topPos}%, 100% - ${size}px - 5px)`;
      node.style.left = `clamp(100px, ${leftPos}%, 100% - ${size}px - 5px)`;
    }, 0);
    /** ^ Even though the setTimeout is 0, the event loop will push this
     * callback to the stack only when the stack will be empty ( including
     * handleAddShape ).
     * Great talk from JSConf: https://www.youtube.com/watch?v=8aGhZQkoFbQ
    */

    node.addEventListener('click', handleFocusShape);
    document.getElementById('shapeList').appendChild(node);
    render();
  }

  function handleFocusShape(event) {
    clearActiveShapes();
    const target = event.currentTarget;
    panelRef.focus();

    target.className += ' target';
    panelRef.style.display = 'block';
    panelRef.style.top = target.style.top;
    panelRef.style.left = target.style.left;

    isActiveshape = true;
  }

  function handleRemoveShape(event) {
    event.stopPropagation();
    const target = document.getElementsByClassName('target')[0];

    if (target)
      target.remove();

    panelRef.style.display = 'none';
    panelRef.blur();
    isActiveShape = false;
  }

  function handleRotateShape(event) {
    event.stopPropagation();

    const target = document.getElementsByClassName('target')[0];
    if (target)
      target.className += ' rotate';
  }

  function handleFocusOutPanel() {
    clearActiveShapes();
    panelRef.style.display = 'none';
  }

  // Helpers
  function clearActiveShapes() {
    document.querySelectorAll('.shape').forEach(elem => {
      elem.className = elem.className.replace('target', '');
    });

    //panelRef.blur();
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function getRandomIntRange(min, max) {
    return getRandomInt(max - min) + min;
  }

  function render() {
    const welcomeMsgElem = document.getElementById('initMsg');
    if(shapeCount > 0)
      welcomeMsgElem.style.display = 'block';
    else
      welcomeMsgElem.style.display = 'none';
  }

  function getRandomShape() {
    const shapeKeys = Object.keys(shapeList);
    const randIndex = getRandomInt(shapeKeys.length);

    return shapeList[shapeKeys[randIndex]];
  }
}