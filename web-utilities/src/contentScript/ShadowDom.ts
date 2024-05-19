import React, { useEffect } from "react";
import ReactDOM from "react-dom";

export function ShadowDom({
  parentElement,
  position = "beforebegin",
  children,
}: // styles = "",
{
  parentElement: Element;
  position?: InsertPosition;
  children: React.ReactNode;
  // styles: string;
}) {
  const [shadowHost] = React.useState(() =>
    document.createElement("my-shadow-host")
  );

  const [shadowRoot] = React.useState(() => {
    let u = shadowHost.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
    #overlayWrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999999;
    } 
    .crosshairs {
      position: fixed;
      width: 100%;
      z-index: 2147483645;
    }
    
    .crosshairs.hidden {
      display: none;
    }
    
    .crosshairs::before,
    .crosshairs::after {
      content: "";
      position: absolute;
    }
    
    .crosshairs::before {
      height: 24px;
      width: 2px;
      background: #000;
      top: -11px;
    }
    
    .crosshairs::after {
      width: 24px;
      height: 2px;
      background: #000;
      left: -11px;
    }
    
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    .overlay.true {
      background: none;
      border-color: rgba(0, 0, 0, 0.5);
      border-style: solid;
    }
    
    .crosshairs,
    .crosshairs:before,
    .crosshairs:after,
    .overlay,
    .overlay:before,
    .overlay:after {
      box-sizing: border-box;
    }
    
  `;
    u.appendChild(style);
    return u;
    // background-color: #0000004d;
  });

  React.useLayoutEffect(() => {
    if (parentElement) {
      parentElement.insertAdjacentElement(position, shadowHost);
    }

    return () => {
      shadowHost.remove();
    };
  }, [parentElement, shadowHost, position]);

  return ReactDOM.createPortal(children, shadowRoot);
}
