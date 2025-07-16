// src/lib/actions/inView.js

/**
 * @typedef {Object} InViewOptions
 * @property {Element | Document | null} [root=null] - The element that is used as the viewport for checking visibility. Defaults to the browser viewport.
 * @property {string} [rootMargin='0px'] - Margin around the root. Can have values similar to the CSS margin property.
 * @property {number | number[]} [threshold=0.1] - A single number or an array of numbers indicating at what percentage of the target's visibility the observer's callback should be executed.
 * @property {boolean} [unobserveOnEnter=false] - If true, the observer will stop observing the node after it enters the viewport for the first time.
 */

/**
 * @typedef {Object} InViewAttributes - Optional attributes for event handlers.
 * @property {(e: CustomEvent<HTMLElement>) => void} [onenterView] - Custom event handler for when the element enters the view.
 * @property {(e: CustomEvent<HTMLElement>) => void} [onexitView] - Custom event handler for when the element exits the view.
 */

/**
 * Svelte Action to detect when an element enters or exits the viewport.
 * Dispatches `enterView` and `exitView` custom events.
 *
 * @param {HTMLElement} node - The node that the action is applied to.
 * @param {InViewOptions} [options] - Configuration options for the IntersectionObserver.
 * @returns {{update: (newOptions?: InViewOptions) => void, destroy: () => void}} - Action lifecycle methods.
 */
export const inView = (node, options) => {
    /** @type {IntersectionObserver} */
    let observer;
  
    /** @type {IntersectionObserverCallback} */
    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        // Use detail to pass the triggering node itself in the event
        const eventName = entry.isIntersecting ? 'enterView' : 'exitView';
        node.dispatchEvent(new CustomEvent(eventName, { detail: node }));
  
        if (entry.isIntersecting && options?.unobserveOnEnter) {
          if (observer) { // Check if observer exists before unobserving
              observer.unobserve(node);
          }
        }
      });
    };
  
    /**
     * Sets up or resets the IntersectionObserver.
     * @param {InViewOptions} [opts] - Observer options.
     */
    const setObserver = (opts) => {
      if (observer) observer.disconnect(); // Clean up previous observer
  
      // Default values
      const root = opts?.root ?? null;
      const rootMargin = opts?.rootMargin ?? '0px';
      const threshold = opts?.threshold ?? 0.1; // Default threshold 0.1 (10%)
  
      observer = new IntersectionObserver(handleIntersect, {
        root,
        rootMargin,
        threshold,
      });
      observer.observe(node);
    }
  
    // Initial setup
    setObserver(options);
  
    return {
      /**
       * Handles reactive updates to the options.
       * @param {InViewOptions} [newOptions] - The updated options.
       */
      update(newOptions) {
        // Update the internal options reference for the handleIntersect check
        options = newOptions;
        setObserver(newOptions);
      },
      /**
       * Cleans up the observer when the component is destroyed.
       */
      destroy() {
        if (observer) {
          observer.disconnect();
        }
      }
    };
  };