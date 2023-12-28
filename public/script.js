"use strict";

(function () {
  let socket = io.connect("https://41a4-182-253-126-4.ngrok-free.app");
  let canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker"),
    clearCanvas = document.querySelector(".clear-canvas"),
    saveImg = document.querySelector(".save-img"),
    context = canvas.getContext("2d");

  let current = {
    color: "black",
    tools: "brush",
    brushWidth: 2,
    fill: false,
    startX: 0,
    startY: 0,
  };

  sizeSlider.addEventListener(
    "change",
    () => (current.brushWidth = sizeSlider.value)
  );
  fillColor.addEventListener("change", () => {
    current.fill = fillColor.checked;
  });
  colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".options .selected").classList.remove("selected");
      btn.classList.add("selected");
      current.color = window
        .getComputedStyle(btn)
        .getPropertyValue("background-color");
    });
  });

  toolBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".options .active").classList.remove("active");
      btn.classList.add("active");
      current.tools = btn.id;
    });
  });

  colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
  });

  clearCanvas.addEventListener("click", () => {
    clear();
    socket.emit("clear");
  });
  saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `KELOMPOK 7 - ${new Date().toLocaleDateString()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
  let drawing = false;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mouseup", onMouseUp, false);
  canvas.addEventListener("mouseout", onMouseUp, false);
  canvas.addEventListener("mousemove", throttle(onMouseMove, 10), false);

  canvas.addEventListener("touchstart", onMouseDown, false);
  canvas.addEventListener("touchend", onMouseUp, false);
  canvas.addEventListener("touchcancel", onMouseUp, false);
  canvas.addEventListener("touchmove", throttle(onMouseMove, 10), false);
  socket.on("drawing", onDrawingEvent);
  socket.on("clear", clear);

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawLine(
    x0,
    y0,
    x1,
    y1,
    color,
    emit,
    tools,
    brushWidth,
    fill,
    startX,
    startY
  ) {
    context.beginPath();
    if (tools === "brush" || tools === "eraser") {
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = tools === "eraser" ? "#fff" : color;
      context.lineWidth = brushWidth;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.stroke();
    } else if (tools === "rectangle") {
      if (fill) {
        context.lineWidth = brushWidth;
        context.strokeStyle = color;
        context.fillStyle = color;
        context.rect(startX, startY, x1 - startX, y1 - startY);
        context.fill();
      } else {
        context.lineWidth = brushWidth;
        context.strokeStyle = color;
        context.rect(startX, startY, x1 - startX, y1 - startY);
        context.stroke();
      }
    } else if (tools === "circle") {
      if (fill) {
        context.lineWidth = brushWidth;
        context.strokeStyle = color;
        context.fillStyle = color;
        context.arc(x0, y0, Math.abs(x1 - x0), 0, 2 * Math.PI);
        context.fill();
      } else {
        context.lineWidth = brushWidth;
        context.strokeStyle = color;
        context.arc(x0, y0, Math.abs(x1 - x0), 0, 2 * Math.PI);
        context.stroke();
      }
    } else {
      if (fill) {
        context.lineWidth = brushWidth;
        context.strokeStyle = color;
        context.fillStyle = color;
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineTo(x0, y1);
        context.lineTo(x0, y0);
        context.fill();
      } else {
        context.lineWidth = brushWidth;
        context.strokeStyle = color;
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineTo(x0, y1);
        context.lineTo(x0, y0);
        context.stroke();
      }
    }
    context.closePath();

    if (!emit) {
      return;
    }

    let w = canvas.width;
    let h = canvas.height;

    socket.emit("drawing", {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color,
      tools: tools,
      brushWidth: brushWidth,
      fill: fill,
    });
  }

  function onMouseDown(e) {
    drawing = true;
    current.x =
      e.offsetX || e?.touches[0].pageX - e?.touches[0].target.offsetLeft;
    current.y =
      e.offsetY || e?.touches[0].pageY - e?.touches[0].target.offsetTop;
    current.startX = current.x;
    current.startY = current.y;
  }

  function onMouseUp(e) {
    if (!drawing) {
      return;
    }
    drawing = false;
    let offsetX, offsetY;
    if (e.type === "touchend" && e.changedTouches) {
      offsetX =
        e.changedTouches[0].pageX - e.changedTouches[0].target.offsetLeft;
      offsetY =
        e.changedTouches[0].pageY - e.changedTouches[0].target.offsetTop;
    } else {
      offsetX = e.offsetX;
      offsetY = e.offsetY;
    }
    drawLine(
      current.x,
      current.y,
      offsetX,
      offsetY,
      current.color,
      true,
      current.tools,
      current.brushWidth,
      current.fill,
      current.startX,
      current.startY
    );
  }

  function onMouseMove(e) {
    if (!drawing || (current.tools !== "brush" && current.tools !== "eraser")) {
      return;
    }
    drawLine(
      current.x,
      current.y,
      e.offsetX || e.touches[0].pageX - e.touches[0].target.offsetLeft,
      e.offsetY || e.touches[0].pageY - e.touches[0].target.offsetTop,
      current.color,
      true,
      current.tools,
      current.brushWidth,
      current.fill,
      current.startX,
      current.startY
    );
    current.x =
      e.offsetX || e.touches[0].pageX - e.touches[0].target.offsetLeft;
    current.y = e.offsetY || e.touches[0].pageY - e.touches[0].target.offsetTop;
  }

  function throttle(callback, delay) {
    let previousCall = new Date().getTime();
    return function () {
      let time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data) {
    let w = canvas.width;
    let h = canvas.height;
    drawLine(
      data.x0 * w,
      data.y0 * h,
      data.x1 * w,
      data.y1 * h,
      data.color,
      false,
      data.tools,
      data.brushWidth,
      data.fill,
      current.startX,
      current.startY
    );
  }
})();
