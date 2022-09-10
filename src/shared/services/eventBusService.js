function on(eventName: string, callListener: () => void): () => void {
  window.addEventListener(eventName, callListener);

  return () => {
    window.removeEventListener(eventName, callListener);
  };
}

function emit(eventName, data) {
  window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
}

export const eventBusService = { on, emit };

window.myBus = eventBusService;
