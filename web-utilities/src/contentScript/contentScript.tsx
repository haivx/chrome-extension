import React, { useEffect, useState, useRef } from "react";
import { Card } from "@material-ui/core";
import { createRoot } from "react-dom/client";
import { WeatherCard } from "../components/WeatherCard";
import "./contentScript.css";
import html2canvas from "html2canvas";

import {
  LocalStorage,
  LocalStorageOptions,
  getStoredOptions,
} from "../utils/storage";
import { Messages } from "../utils/messages";
import { ShadowDom } from "./ShadowDom";

const takeScreenshot = async (
  cropPositionTop: number,
  cropPositionLeft: number,
  cropWidth: number,
  cropHeight: number
) => {
  const body = document.querySelector("body");
  if (!body) {
    throw new Error("ScreenCapture could not find body");
  }

  const canvas = await html2canvas(body);
  const croppedCanvas = document.createElement("canvas");
  const croppedCanvasContext = croppedCanvas.getContext("2d");

  croppedCanvas.width = cropWidth;
  croppedCanvas.height = cropHeight;

  if (croppedCanvasContext) {
    croppedCanvasContext.drawImage(
      canvas,
      cropPositionLeft,
      cropPositionTop,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );
  }

  return croppedCanvas.toDataURL();
};

const ContentScript = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 });
  const [crosshairs, setCrosshairs] = useState({ top: 0, left: 0 });
  const [mouseDown, setMouseDown] = useState(false);
  const [cropPosition, setCropPosition] = useState({ top: 0, left: 0 });
  const [cropSize, setCropSize] = useState({ width: 0, height: 0 });
  const [show, setShow] = useState(false);
  useEffect(() => {
    getStoredOptions().then((opts) => {
      setOptions(opts);
      setIsActive(opts?.hasAuthoOverlay);
    });
  }, []);
  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      console.log("CONTENT SCRIPT", msg);
      if (msg === Messages.TOGGLE_OVERLAY) {
        setIsActive(!isActive);
      }
    });
  }, [isActive]);

  const handleMouseMove = (e: MouseEvent) => {
    console.log("handleMouseMove");
    if (!mouseDown) return;
    setCrosshairs({ top: e.clientY, left: e.clientX });
    setCropSize({
      width: Math.abs(e.clientX - mouseStart.x) * window.devicePixelRatio,
      height: Math.abs(e.clientY - mouseStart.y) * window.devicePixelRatio,
    });
    setCropPosition({
      top: Math.min(e.clientY, mouseStart.y),
      left: Math.min(e.clientX, mouseStart.x),
    });
  };

  const onEndCapture = (dataUrl) => {
    var imgTag = '<img src="' + dataUrl + '">'; // Display image in new tab

    var a = document.createElement("a");
    a.href = dataUrl;
    a.download = "filename";
    document.body.appendChild(a);
    a.click();
  };

  const handleMouseDown = (e: MouseEvent) => {
    console.log("handleMouseDown");
    setMouseStart({
      x: e.clientX,
      y: e.clientY,
    });
    setMouseDown(true);
    setCropPosition({
      top: e.clientY,
      left: e.clientX,
    });
    setCropSize({
      width: 0,
      height: 0,
    });
  };

  const handleMouseUp = () => {
    if (cropSize.width && cropSize.height && mouseDown) {
      takeScreenshot(
        cropPosition.top,
        cropPosition.left,
        cropSize.width,
        cropSize.height
      ).then(onEndCapture);
    }
    setMouseDown(false);
    setCropSize({
      width: 0,
      height: 0,
    });
  };

  // const handleMouseEnter = () => {
  //   setShow(true);
  // };

  // const handleMouseLeave = () => {
  //   setShow(false);
  //   setMouseDown(false);
  // };

  if (!options || !isActive) return null;

  return (
    <ShadowDom parentElement={document.getElementsByTagName("BODY")[0]}>
      <div
        id="overlayWrapper"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
      >
        overlayWrapper
        {
          <>
            <div
              className={`overlay ${mouseDown}`}
              style={{
                top: cropPosition.top,
                left: cropPosition.left,
                width: cropSize.width,
                height: cropSize.height,
              }}
            />
            <div
              className={`crosshairs`}
              style={{
                left: crosshairs.left + "px",
                top: crosshairs.top + "px",
              }}
            />
          </>
        }
      </div>
    </ShadowDom>
  );
};

const appContainer = document.createElement("div");
document.body.appendChild(appContainer);
const target = document.body.appendChild(document.createElement("DIV"));
target.attachShadow({ mode: "open" });
const root = createRoot(appContainer);
root.render(<ContentScript />);
