// src/lib/calculateSize.js
export function calculateMyCustomSizes() {
    let canvas = parseFloat(calculateCssVariable('--tx-canvas-size'))
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1440; // Default to 1920 for build time (Node.js)
    // const txp = ((viewportWidth-viewportWidth/10) * 4.427) / 100;
    // const tx = (viewportWidth-viewportWidth/10) / 1440;
    const txp = ((viewportWidth) * 4.427) / 100;
    const tx = (viewportWidth) / 1440;

    return { txp, tx };
}

export function calculateCssVariable(variableName) {
    const rootStyles = getComputedStyle(document.documentElement);
    const cssVarString = rootStyles.getPropertyValue(variableName).trim();

    const match = cssVarString.match(/calc\(\s*(.*?)\s*\/\s*(.*?)\s*\)/);
    if (match) {
      const numeratorExpression = match[1];
      const denominatorValue = parseFloat(match[2]);
      if (!isNaN(denominatorValue) && denominatorValue !== 0) {
        if (numeratorExpression === "100vw") {
          return window.innerWidth / denominatorValue;
        } else {
        //   console.error("Unsupported calc() numerator:", numeratorExpression);
          return null;
        }
      } else {
        // console.error("Invalid denominator in calc() expression:", cssVarString);
        return null;
      }
    } else {
    //   console.error("Invalid calc() expression:", cssVarString);
      return cssVarString;
    }
  }