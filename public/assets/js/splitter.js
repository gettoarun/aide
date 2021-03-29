function manageResize(md, sizeProp, posProp) {
    var r = md.target;
  
    var prev = r.previousElementSibling;
    var next = r.nextElementSibling;
    if (!prev || !next) {
      return;
    }
  
    md.preventDefault();
  
    var prevSize = prev[sizeProp];
    var nextSize = next[sizeProp];
    var sumSize = prevSize + nextSize;
    var prevGrow = Number(prev.style.flexGrow);
    var nextGrow = Number(next.style.flexGrow);
    var sumGrow = prevGrow + nextGrow;
    var lastPos = md[posProp];
  
    function onMouseMove(mm) {
      var pos = mm[posProp];
      var d = pos - lastPos;
      prevSize += d;
      nextSize -= d;
      if (prevSize < 0) {
        nextSize += prevSize;
        pos -= prevSize;
        prevSize = 0;
      }
      if (nextSize < 0) {
        prevSize += nextSize;
        pos += nextSize;
        nextSize = 0;
      }
  
      var prevGrowNew = sumGrow * (prevSize / sumSize);
      var nextGrowNew = sumGrow * (nextSize / sumSize);
  
      prev.style.flexGrow = prevGrowNew;
      next.style.flexGrow = nextGrowNew;
  
      lastPos = pos;
    }
  
    function onMouseUp(mu) {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
  
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }
  
  function setupResizerEvents() {
    document.body.addEventListener("mousedown", function(md) {
      var target = md.target;
      if (target.nodeType !== 1 || target.tagName !== "FLEX-RESIZER") {
        return;
      }
      var parent = target.parentNode;
      var h = parent.classList.contains("h");
      var v = parent.classList.contains("v");
      if (h && v) {
        return;
      } else if (h) {
        manageResize(md, "scrollWidth", "pageX");
      } else if (v) {
        manageResize(md, "scrollHeight", "pageY");
      }
    });
  }
  
  setupResizerEvents();